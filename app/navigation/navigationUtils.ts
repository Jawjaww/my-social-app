import { createNavigationContainerRef } from "@react-navigation/native";
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
  MainTabParamList,
} from "./navigationTypes";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type NestedNavigateParams = {
  Auth: { screen: keyof AuthStackParamList; params?: AuthStackParamList[keyof AuthStackParamList] };
  Main: { screen: keyof MainStackParamList; params?: MainStackParamList[keyof MainStackParamList] | { screen: keyof MainTabParamList } };
};

export function navigate(
  name: keyof RootStackParamList,
  params?: NestedNavigateParams[keyof NestedNavigateParams]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params as any);
  }
}

export const nestedNavigate = (
  stackName: keyof RootStackParamList,
  screenName: string,
  params?: object
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(stackName, {
      screen: screenName,
      params,
    } as never);
  }
};