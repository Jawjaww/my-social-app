import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "../../toast/toastSlice";
import { setProfile } from "../../profile/profileSlice";
import {
  useUpdateUsernameMutation,
  useCheckUsernameAvailabilityMutation,
} from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CenteredContainer,
  Container,
  Input,
  Button,
  ButtonText,
  ErrorText,
  CardText,
  StyledActivityIndicator,
} from "../../../components/StyledComponents";
import { useTheme } from "@emotion/react";
import { selectProfile } from "../../profile/profileSelectors";
import { selectUser } from "../../authentication/authSelectors";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("username.required")
    .min(3, "username.tooShort") // Minimum 3 characters
    .max(20, "username.tooLong") // Maximum 20 characters
    .matches(/^[a-zA-Z0-9_]+$/, "username.invalidCharacters") // Only letters, numbers and underscores
    .test("no-spaces", "username.noSpaces", (value) => !/\s/.test(value)), // No spaces
});

function ChooseUsernameScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [updateUsername, { isLoading }] = useUpdateUsernameMutation();
  const [checkUsernameAvailability] = useCheckUsernameAvailabilityMutation();
  const theme = useTheme();
  const profile = useSelector(selectProfile);
  const user = useSelector(selectUser);
  const [usernameStatus, setUsernameStatus] = useState<
    "available" | "taken" | "loading" | null
  >(null);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // useEffect(() => {
  //   console.log("ChooseUsernameScreen mounted:", { profile, user });
  // }, [profile, user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUsernameChange = async (username: string) => {
    setCurrentUsername(username);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    try {
      await schema.validate({ username });
    } catch (validationError) {
      setUsernameStatus(null);
      return;
    }

    setTypingTimeout(
      setTimeout(async () => {
        try {
          const availabilityResult = await checkUsernameAvailability(
            username.trim()
          ).unwrap();
          setUsernameStatus(availabilityResult.available ? "available" : "taken");
        } catch (error) {
          console.error("Error checking username availability:", error);
        }
      }, 1000)
    );
  };

  const onSubmit = async (data: { username: string }) => {
    try {
      const uid = user?.uid;
      if (!uid) {
        console.error("UID is missing:", user, uid);
        throw new Error("UID is missing");
      }
  
      const availabilityResult = await checkUsernameAvailability(
        data.username.trim()
      ).unwrap();
      if (!availabilityResult.available) {
        setError("username", { type: "manual", message: t("username.taken") });
        return;
      }
  
      // Update the username in the database
      const result = await updateUsername({
        uid,
        username: data.username.trim(),
      }).unwrap();
  
      // Update the username in the store
      dispatch(setProfile({
        ...profile,
        uid,
        username: data.username.trim()
      }));
      console.log("Username updated in store:", result);
      dispatch(addToast({ message: t("username.success"), type: "success" }));
      // Don't need to redirect because appnavigation automatically redirect user
    } catch (error) {
      console.error("Error in onSubmit:", error);
      dispatch(addToast({ message: t("username.error"), type: "error" }));
    }
  };
  
  return (
    <CenteredContainer>
      <Container>
        <CardText>{t("username.choose")}</CardText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Input
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  handleUsernameChange(text);
                }}
                value={value}
                placeholder={t("username.placeholder")}
              />
              {usernameStatus === "available" && (
                <Text style={{ color: "green" }}>
                  {t("username.available", { username: currentUsername })}
                </Text>
              )}
              {usernameStatus === "taken" && (
                <Text style={{ color: "red" }}>
                  {t("username.taken", { username: currentUsername })}
                </Text>
              )}
              {usernameStatus === "loading" && (
                <Text style={{ color: "blue" }}>{t("username.loading")}</Text>
              )}
            </>
          )}
          name="username"
          defaultValue=""
        />
        {errors.username && (
          <ErrorText>{t(errors.username.message as string)}</ErrorText>
        )}
        <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? (
            <StyledActivityIndicator size="small" color={theme.colors.background} />
          ) : (
            <ButtonText>{t("common.save")}</ButtonText>
          )}
        </Button>
      </Container>
    </CenteredContainer>
  );
}

export default ChooseUsernameScreen;