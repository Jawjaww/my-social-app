export default {
  expo: {
    name: "my_social_app",
    slug: "mysocialapp",
    scheme: "my-social-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    
    // Splash screen configuration
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#007AFF"
    },
    
    userInterfaceStyle: "light",
    
    // Updates configuration
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/ac182c59-77c0-4856-97f4-a5235b127f65"
    },
    
    // iOS specific configuration
    ios: {
      googleServicesFile: "./GoogleService-Info.plist",
      supportsTablet: true,
      bundleIdentifier: "com.jawjaww.mysocialapp",
      infoPlist: {
        NSPhotoLibraryUsageDescription: "L'autorisation d'accès à la bibliothèque multimédia est nécessaire pour gérer votre avatar.",
        NSCameraUsageDescription: "L'autorisation d'accès à la caméra est nécessaire pour prendre une photo de profil.",
        NSMicrophoneUsageDescription: "L'autorisation d'accès au microphone est nécessaire pour utiliser la fonctionnalité de publication de vidéos.",
        UIBackgroundModes: ["remote-notification"]
      },
      associatedDomains: [
        "applinks:mysocialapp.expo.dev"
      ]
    },
    
    // Android specific configuration
    android: {
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA",
        "RECORD_AUDIO",
        "RECEIVE_BOOT_COMPLETED",
        "SCHEDULE_EXACT_ALARM",
        "POST_NOTIFICATIONS",
        "READ_MEDIA_AUDIO",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO"
      ],
      package: "com.brainsmosaique.MySocialApp",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "mysocialapp.expo.dev",
              pathPrefix: "/auth"
            }
          ],
          category: [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    },
    
    web: {
      favicon: "./assets/favicon.png"
    },
    
    extra: {
      eas: {
        projectId: "ac182c59-77c0-4856-97f4-a5235b127f65"
      }
    },
    
    owner: "jawjaww",
    
    // Plugins configuration
    plugins: [
      [
        "@sentry/react-native/expo",
        {
          organization: "brains-mosaic",
          project: "my-social-app"
        }
      ],
      "@config-plugins/react-native-webrtc",
      "expo-localization",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png"
        }
      ],
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production"
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0"
          }
        }
      ],
      "@react-native-firebase/app"
    ],
    
    runtimeVersion: {
      policy: "appVersion"
    }
  }
}; 