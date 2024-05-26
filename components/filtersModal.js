import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitaliz, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { ColorsFilters, SectionView } from "./filterViews";
import { CommmonFiltersRow } from "./filterViews";
import { data } from "../constants/data";

const FiltersModal = ({
  modalRef,
  filters,
  setFilters,
  onclose,
  onApply,
  onReset,
}) => {
  const snapPoints = useMemo(() => ["75%", "75%"], []); // we can stop thge modal at different heights with thi snapPoint
  return (
    <BottomSheetModal
      ref={modalRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
      //   onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filter </Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitaliz(sectionName);
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
                key={sectionName}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}
          {/* Actions */}
          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.actionsContainer}
          >
            <Pressable
              onPress={onReset}
              style={[styles.resetButton, { color: theme.colors.neutral(0.9) }]}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
            <Pressable onPress={onApply} style={[styles.ApplyButton]}>
              <Text style={[styles.buttonText, { color: "#fff" }]}>Apply</Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommmonFiltersRow {...props} />,
  orientation: (props) => <CommmonFiltersRow {...props} />,
  type: (props) => <CommmonFiltersRow {...props} />,
  colors: (props) => <ColorsFilters {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      {/*Blur View */}
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={20} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    gap: 15,
    // width: "100%",

    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resetButton: {
    alignItems: "center",
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.neutral(0.3),
    padding: 12,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  ApplyButton: {
    alignItems: "center",
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  buttonText: {
    fontSize: hp(2.2),
  },
});
export default FiltersModal;
