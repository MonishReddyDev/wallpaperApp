import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import { router } from "expo-router";

const ImageCard = ({ item, index, columns }) => {
  const isLastinRow = () => {
    return (index + 1) % columns === 0;
  };
  const getImageHeight = () => {
    let { imageWidth: width, imageHeight: height } = item;
    return { height: getImageSize(height, width) };
  };

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "home/image", params: { ...item } })
      }
      style={[styles.ImageWrapper, !isLastinRow() && styles.spacing]}
    >
      <Image
        style={[styles.Image, getImageHeight()]}
        source={item.webformatURL}
        transition={200}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Image: {
    height: 300,
    width: "100%",
  },
  ImageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    marginBottom: wp(2),
    borderCurve: "continuous",
  },
  spacing: {
    marginRight: wp(2),
  },
});
export default ImageCard;
