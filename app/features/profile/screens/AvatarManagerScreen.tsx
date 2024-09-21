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
import { Ionicons } from "@expo/vector-icons";
import { addToast } from "../../toast/toastSlice";
import { ProfileStackParamList, ProfileUser } from "../../../types/sharedTypes";
import {
  CenteredContainer,
  Container,
  Card,
  CardText,
} from "../../../components/StyledComponents";
import { setProfile } from "../../profile/profileSlice";
import { selectProfile } from "../../profile/profileSelectors";
import { useUpdateAvatarUriMutation } from "../../../services/api";
import AvatarPhoto from "../../../components/AvatarPhoto";

const AvatarManagerScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [image, setImage] = useState<string | null>(profile?.avatarUri || null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [updateAvatarUri] = useUpdateAvatarUriMutation();

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
      const picturesDir = FileSystem.documentDirectory + "Pictures/";
      const appDir = picturesDir + "mysocialapp/";
      const avatarDir = appDir + "appavatar/";

      // Create the directories if they don't exist
      await FileSystem.makeDirectoryAsync(picturesDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(appDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(avatarDir, { intermediates: true });

      // Delete all files in the avatar directory
      const files = await FileSystem.readDirectoryAsync(avatarDir);
      for (const file of files) {
        await FileSystem.deleteAsync(avatarDir + file, { idempotent: true });
      }

      const fileName = `avatar_${profile?.uid}_${Date.now()}.jpg`;
      const filePath = avatarDir + fileName;

      // Copy the new avatar
      await FileSystem.copyAsync({
        from: imageUri,
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
          setIsLoading(true);
          const localPath = await saveAvatarLocally(result.path);
          setImage(localPath);

          if (profile) {
            const response = await updateAvatarUri({
              userId: profile.uid,
              avatarUri: localPath,
            });

            if ("error" in response) {
              throw new Error(JSON.stringify(response.error));
            }

            const updatedProfile: ProfileUser = {
              ...profile,
              avatarUri: localPath,
            };
            dispatch(setProfile(updatedProfile));

            dispatch(
              addToast({
                message: t("editProfilePicture.success"),
                type: "success",
              })
            );

            navigation.reset({
              index: 0,
              routes: [{ name: "ProfileHome" }],
            });
          }
        }
      } catch (error) {
        console.error("Error picking image:", error);
        dispatch(
          addToast({ message: t("editProfilePicture.error"), type: "error" })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [profile, dispatch, t, updateAvatarUri, hasPermission, saveAvatarLocally, navigation]
  );

  const handleDelete = useCallback(async () => {
    if (!profile) return;

    try {
      setIsLoading(true);
      const response = await updateAvatarUri({
        userId: profile.uid,
        avatarUri: null,
      });

      if ("error" in response) {
        throw new Error(JSON.stringify(response.error));
      }

      const updatedProfile: ProfileUser = {
        ...profile,
        avatarUri: null,
      };
      dispatch(setProfile(updatedProfile));

      dispatch(
        addToast({
          message: t("editProfilePicture.deleteSuccess"),
          type: "success",
        })
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "ProfileHome" }],
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      dispatch(
        addToast({ message: t("editProfilePicture.deleteError"), type: "error" })
      );
    } finally {
      setIsLoading(false);
    }
  }, [profile, dispatch, t, updateAvatarUri, navigation]);

  return (
    <CenteredContainer>
      <Container>
        <AvatarPhoto size={220} uri={image} username={profile?.username} />

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

        {isLoading && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
      </Container>
    </CenteredContainer>
  );
};

export default AvatarManagerScreen;