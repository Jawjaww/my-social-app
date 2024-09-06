import React, { useState, useCallback, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import ImagePicker, {
  Image as ImagePickerImage,
  Options as ImagePickerOptions,
} from "react-native-image-crop-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";
import { addToast } from "../../toast/toastSlice";
import { ProfileStackParamList } from "../../../types/sharedTypes";
import {
  CenteredContainer,
  Container,
  AvatarContainer,
  AvatarImage,
  AvatarPlaceholder,
  AvatarText,
  Card,
  CardText,
} from "../../../components/StyledComponents";
import { setProfile } from "../../profile/profileSlice";
import { selectProfile } from "../../profile/profileSelectors";
import { ProfileUser } from "../../../types/sharedTypes";

const AvatarManagerScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const profileUser = useSelector(selectProfile);
  const [image, setImage] = useState<string | null>(profileUser?.avatarUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        dispatch(
          addToast({ message: t("permissions.mediaLibrary"), type: "error" })
        );
      }
    })();
  }, [dispatch, t]);

  const saveAvatarLocally = async (imageUri: string): Promise<string> => {
    if (!hasPermission) {
      throw new Error("No permission to save avatar");
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      const album = await MediaLibrary.getAlbumAsync("AppAvatars");
      if (album === null) {
        await MediaLibrary.createAlbumAsync("AppAvatars", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      const fileName = `avatar_${profileUser?.uid}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: asset.uri,
        to: filePath,
      });

      return filePath;
    } catch (error) {
      console.error("Error saving avatar locally:", error);
      throw error;
    }
  };

  const pickImage = useCallback(
    async (sourceType: "library" | "camera") => {
      if (!hasPermission) {
        dispatch(
          addToast({ message: t("permissions.mediaLibrary"), type: "error" })
        );
        return;
      }

      try {
        const options: ImagePickerOptions = {
          width: 300,
          height: 300,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: "photo" as const,
          compressImageQuality: 0.8,
        };

        let result: ImagePickerImage;
        if (sourceType === "library") {
          result = await ImagePicker.openPicker(options);
        } else {
          result = await ImagePicker.openCamera(options);
        }

        if (result.path) {
          const localPath = await saveAvatarLocally(result.path);
          setImage(localPath);
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message !== "User cancelled image selection"
        ) {
          console.error("Error picking image:", error);
          dispatch(
            addToast({
              message: t("editProfilePicture.error.picker"),
              type: "error",
            })
          );
        }
      }
    },
    [hasPermission, t, profileUser, dispatch]
  );

  const handleSave = useCallback(async () => {
    if (!image || !profile) return;

    setIsLoading(true);
    try {
      const localUri = await saveAvatarLocally(image);
      const updatedProfile: ProfileUser = {
        ...profile,
        avatarUrl: localUri,
      };
      dispatch(setProfile(updatedProfile));
      dispatch(
        addToast({
          message: t("editProfilePicture.success"),
          type: "success",
        })
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error saving avatar:", error);
      dispatch(
        addToast({
          message: t("editProfilePicture.error"),
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [image, profile, dispatch, t, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      t("editProfilePicture.deleteTitle"),
      t("editProfilePicture.deleteMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.confirm"),
          onPress: async () => {
            if (profile && profile.avatarUrl) {
              await FileSystem.deleteAsync(profile.avatarUrl, {
                idempotent: true,
              });
              const updatedProfile: ProfileUser = {
                ...profile,
                avatarUrl: null,
              };
              dispatch(setProfile(updatedProfile));
            }
            setImage(null);
            dispatch(
              addToast({
                message: t("editProfilePicture.deleteSuccess"),
                type: "success",
              })
            );
          },
          style: "destructive",
        },
      ]
    );
  }, [profile, dispatch, t]);

  if (!hasPermission) {
    return (
      <CenteredContainer>
        <Container>
          <CardText>{t("permissions.mediaLibraryNeeded")}</CardText>
        </Container>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <Container>
        <AvatarContainer>
          {image ? (
            <AvatarImage
              source={{ uri: image, priority: FastImage.priority.high }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <AvatarPlaceholder>
              <AvatarText>
                {profile?.username?.[0].toUpperCase() || "?"}
              </AvatarText>
            </AvatarPlaceholder>
          )}
        </AvatarContainer>

        <Card onPress={() => pickImage("library")}>
          <Ionicons
            name="images-outline"
            size={30}
            color={theme.colors.primary}
          />
          <CardText>{t("avatarManager.gallery")}</CardText>
        </Card>

        <Card onPress={() => pickImage("camera")}>
          <Ionicons
            name="camera-outline"
            size={30}
            color={theme.colors.primary}
          />
          <CardText>{t("avatarManager.camera")}</CardText>
        </Card>

        <Card onPress={handleDelete}>
          <Ionicons name="trash-outline" size={30} color={theme.colors.error} />
          <CardText>{t("avatarManager.delete")}</CardText>
        </Card>

        <Card onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons
              name="save-outline"
              size={30}
              color={theme.colors.primary}
            />
          )}
          <CardText>{t("avatarManager.save")}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default AvatarManagerScreen;
