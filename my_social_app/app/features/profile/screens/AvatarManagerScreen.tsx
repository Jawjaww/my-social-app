import React, { useState, useCallback, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import ImagePicker, { Image as ImagePickerImage, Options as ImagePickerOptions } from "react-native-image-crop-picker";
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
import { CenteredContainer, Container, Card, CardText } from "../../../components/StyledComponents";
import { setProfile } from "../profileSlice";
import { selectProfile } from "../profileSelectors";
import { useUpdateAvatarUrlMutation, useUploadAvatarMutation } from "../../../services/api";
import AvatarPhoto from "../../../components/AvatarPhoto";

const AvatarManagerScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [imageUri, setImageUri] = useState<string | null>(profile?.avatarUri || null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [updateAvatarUrl] = useUpdateAvatarUrlMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

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

  const saveAvatarLocally = async (sourceUri: string): Promise<string> => {
    try {
      const avatarDir = FileSystem.documentDirectory + "avatars/";
      const userAvatarDir = avatarDir + `${profile?.uid}/`;

      // Create avatar repertory if it doesn't exist
      await FileSystem.makeDirectoryAsync(userAvatarDir, { intermediates: true });

      // Delete existing avatar files for the user
      const files = await FileSystem.readDirectoryAsync(userAvatarDir);
      for (const file of files) {
        await FileSystem.deleteAsync(userAvatarDir + file, { idempotent: true });
      }

      const fileName = `avatar_${Date.now()}.jpg`;
      const filePath = userAvatarDir + fileName;

      // Copy the new avatar into the user's directory
      await FileSystem.copyAsync({
        from: sourceUri,
        to: filePath,
      });

      return filePath;
    } catch (error) {
      console.error("Error saving avatar locally:", error);
      throw error;
    }
  };

  const pickImage = useCallback(async (sourceType: "library" | "camera") => {
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
        mediaType: "photo",
        compressImageQuality: 0.8,
      };

      let result: ImagePickerImage;
      if (sourceType === "library") {
        result = await ImagePicker.openPicker(options);
      } else {
        result = await ImagePicker.openCamera(options);
      }

      if (result.path && profile) {
        setIsLoading(true);

        try {
          // Upload the image to Cloudinary
          const cloudinaryUrl = await uploadAvatar({
            imageUri: result.path,
            uid: profile.uid,
          }).unwrap();

          // Save the avatar locally
          const localAvatarPath = await saveAvatarLocally(result.path);

          // Update the profile with the new avatar
          const updatedProfile: ProfileUser = {
            ...profile,
            avatarUri: localAvatarPath, // URI local
            avatarUrl: cloudinaryUrl,   // URL Cloudinary
          };
          dispatch(setProfile(updatedProfile));
          setImageUri(localAvatarPath);

          // Update the avatar URL in Firebase
          await updateAvatarUrl({
            userId: profile.uid,
            avatarUrl: cloudinaryUrl, 
          }).unwrap();

          // Success message
          dispatch(
            addToast({
              message: t("avatarManager.success"),
              type: "success",
            })
          );

          navigation.goBack();
        } catch (error) {
          console.error("Error uploading avatar:", error);
          dispatch(
            addToast({
              message: t("avatarManager.error"),
              type: "error",
            })
          );
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      dispatch(
        addToast({
          message: t("avatarManager.pickError"),
          type: "error",
        })
      );
    }
  }, [hasPermission, dispatch, t, profile, uploadAvatar, saveAvatarLocally, updateAvatarUrl, navigation]);

  const handleDelete = useCallback(async () => {
    if (!profile) return;

    setIsLoading(true);

    try {
      // Delete the avatar locally
      const avatarDir = FileSystem.documentDirectory + "avatars/";
      const userAvatarDir = avatarDir + `${profile.uid}/`;

      await FileSystem.deleteAsync(userAvatarDir, { idempotent: true });

      // Update the profile
      const updatedProfile: ProfileUser = {
        ...profile,
        avatarUri: null,
        avatarUrl: null,
      };
      dispatch(setProfile(updatedProfile));
      setImageUri(null);

      // Update the avatar URL in Firebase
      await updateAvatarUrl({
        userId: profile.uid,
        avatarUrl: null,
      }).unwrap();

      // Success message
      dispatch(
        addToast({ message: t("avatarManager.deleteSuccess"), type: "success" })
      );

      navigation.goBack();
    } catch (error) {
      console.error("Error deleting avatar:", error);
      dispatch(
        addToast({ message: t("avatarManager.deleteError"), type: "error" })
      );
    } finally {
      setIsLoading(false);
    }
  }, [profile, dispatch, t, updateAvatarUrl, navigation]);

  return (
    <CenteredContainer>
      <Container>
        <AvatarPhoto size={220} />

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