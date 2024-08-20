import React, { useState } from "react";
import { Button } from "react-native";
import { useTranslation } from "react-i18next";
import styled from "@emotion/native";
import { useDispatch } from "react-redux";
import { addToast } from "../../toast/toastSlice";
import { setUser } from "../../authentication/authSlice";
import { useUpdateUsernameMutation } from "../../../services/api";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 10px;
  width: 100%;
`;

function ChooseUsernameScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [updateUsername] = useUpdateUsernameMutation();

  const handleChooseUsername = async () => {
    try {
      const result = await updateUsername(username).unwrap();
      dispatch(setUser(result.user));
      dispatch(addToast({ message: t("username.success"), type: "success" }));
      // Navigate to the home screen or another appropriate screen
    } catch (error) {
      dispatch(addToast({ message: t("username.error"), type: "error" }));
    }
  };

  return (
    <Container>
      <Input
        placeholder={t("username.placeholder")}
        value={username}
        onChangeText={setUsername}
      />
      <Button title={t("username.button")} onPress={handleChooseUsername} />
    </Container>
  );
}

export default ChooseUsernameScreen;