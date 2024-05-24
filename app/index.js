import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { wp, hp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.Bgimage}
        resizeMode="cover"
      />
      {/*Linear gradient*/}
      <Animated.View entering={FadeInDown.duration(500)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        {/* Content */}
        <View style={styles.content}>
          <Animated.Text
            entering={FadeInDown.duration(500).springify()}
            style={styles.title}
          >
            Pixels
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(600).springify()}
            style={styles.punchLine}
          >
            Each pixel holds a tale
          </Animated.Text>
          <Animated.View entering={FadeInDown.duration(700).springify()}>
            <Pressable
              style={styles.startButton}
              onPress={() => router.push("home")}
            >
              <Text style={styles.startText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Bgimage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: "absolute",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeight.bold,
  },
  punchLine: {
    fontWeight: theme.fontWeight.medium,
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
  },
  startButton: {
    marginBottom: 50,
    padding: 15,
    backgroundColor: theme.colors.black,
    paddingHorizontal: 90,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  startText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.medium,
    letterSpacing: 1,
    fontSize: hp(3),
  },
});

export default WelcomeScreen;
