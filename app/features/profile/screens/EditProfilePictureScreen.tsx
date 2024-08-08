import React, { useState } from "react";
import { View, Button, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { selectUser } from "../../authentication/authSelectors";
import { useUpdateProfilePictureMutation } from "../../../services/api";
import styled from "@emotion/native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../navigation/AppNavigation";
import Toast from "../../../components/Toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledImage = styled(FastImage)`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

const EditProfilePictureScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const [image, setImage] = useState<string | null>(null);
  const { t } = useTranslation();
  const schema = yup.object().shape({
    image: yup.string().nullable().defined(),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ image: string | null }>({
    resolver: yupResolver(schema),
    defaultValues: {
      image: null,
    },
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [updateProfilePicture, { isLoading, error }] =
    useUpdateProfilePictureMutation();

  const pickImage = async (sourceType: "library" | "camera") => {
    const options: ImagePicker.ImageLibraryOptions | ImagePicker.CameraOptions =
      {
        mediaType: "photo",
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
        includeBase64: false,
      };

    let result;
    if (sourceType === "library") {
      result = await ImagePicker.launchImageLibrary(options);
    } else {
      result = await ImagePicker.launchCamera(options);
    }

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setValue("image", result.assets[0].uri || null);
    }
  };

  const onSubmit = async (data: { image: string | null }) => {
    if (!data.image) return;

    try {
      const downloadURL = await updateProfilePicture({
        uri: data.image,
        isPublic: true,
      }).unwrap();
      Toast({ message: t("editProfilePicture.success"), type: "success" });
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Toast({ message: t("editProfilePicture.error.upload"), type: "error" });
    }
  };

  const handleSave = async () => {
    if (!image) return;

    try {
      const downloadURL = await updateProfilePicture({
        uri: image,
        isPublic: true,
      }).unwrap();
      Toast({ message: t("editProfilePicture.success"), type: "success" });
      // Update the user's profile picture in the global state if necessary
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Toast({ message: t("editProfilePicture.error.upload"), type: "error" });
    }
  };

  const confirmSave = () => {
    Alert.alert(
      t("editProfilePicture.confirmTitle"),
      t("editProfilePicture.confirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        { text: t("common.confirm"), onPress: handleSave },
      ]
    );
  };

  return (
    <Container>
      <Header>{t("editProfilePicture.title")}</Header>
      <ButtonContainer>
        <Button
          title={t("editProfilePicture.chooseFromLibrary")}
          onPress={() => pickImage("library")}
        />
        <Button
          title={t("editProfilePicture.takePhoto")}
          onPress={() => pickImage("camera")}
        />
      </ButtonContainer>
      <Controller
        control={control}
        name="image"
        render={({ field: { onChange, value } }) => (
          <>
            {value && (
              <StyledImage
                source={{
                  uri: value,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
            {errors.image && <ErrorText>{errors.image.message}</ErrorText>}
          </>
        )}
      />
      {error && (
        <ErrorText>
          {(error as any).data?.message ||
            t("editProfilePicture.error.generic")}
        </ErrorText>
      )}
      <Button
        title={t("editProfilePicture.saveButton")}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </Container>
  );
};

export default EditProfilePictureScreen;
