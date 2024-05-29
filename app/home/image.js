import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Platform,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "../../constants/theme";
import { Entypo, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("loading");
  let uri = item.webformatURL;
  const fileName = item.previewURL?.split("/").pop();
  const imageURL = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
    let calculateHeight = maxWidth / aspectRatio + 120;
    let calculateWidth = maxWidth;

    if (aspectRatio < 1) {
      calculateHeight = calculateHeight * aspectRatio;
    }
    return {
      width: calculateWidth,
      height: calculateHeight,
    };
  };
  const onLoad = () => {
    setStatus("");
  };

  const hanldeDownloadImage = async () => {
    if (Platform.OS === "web") {
      const anchore = document.createElement("a");
      anchore.href = imageURL;
      anchore.target = "_blank";
      anchore.download = fileName || "download";
      document.body.appendChild(anchore);
      anchore.click();
      document.body.removeChild(anchore);
    } else {
      setStatus("downloading");
      let uri = await downloadImage();
      if (uri) {
        showToast("Image downloaded");
      }
    }
  };

  const handleShareImage = async () => {
    if (Platform.OS === "web") {
      showToast("link copied");
    } else {
      setStatus("sharing");
      let uri = await downloadImage();
      if (uri) {
        //share
        await Sharing.shareAsync(uri);
      }
    }
  };
  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => {
      return (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      );
    },
  };

  const downloadImage = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageURL, filePath);
      setStatus("");
      //   console.log("Downloaded At :", uri);
      return uri;
    } catch (error) {
      console.log("error message", error.message);
      setStatus("");
      Alert.alert("Image", error.message);
      return null;
    }
  };
  return (
    <BlurView style={styles.continer} tint="dark" intensity={60}>
      <View style={[getSize()]}>
        <View style={styles.Loading}>
          {status === "loading" && (
            <ActivityIndicator size={"large"} color={"white"} />
          )}
        </View>
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          source={{ uri: uri }}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.Buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color={"#fff"} />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size={"small"} color={"white"} />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={hanldeDownloadImage}>
              <Octicons name="download" size={24} color={"#fff"} />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size={"small"} color={"white"} />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={24} color={"#fff"} />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    borderRadius: theme.radius.lg,

    backgroundColor: "rbga(255,255,255,0.1)",
    borderColor: "rbga(255,255,255,0.1)",
  },
  Loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  Buttons: {
    marginTop: 40,
    flexDirection: "row",
    gap: 50,
    alignItems: "center",
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  toastText: {
    fontSize: hp(1.6),
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.white,
  },
});
export default ImageScreen;
