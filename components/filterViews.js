import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../constants/theme";
import { capitaliz, hp } from "../helpers/common";
import { iteratee } from "lodash";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommmonFiltersRow = ({
  data,
  filters,
  setFilters,
  filterName,
}) => {
  const onSelectItem = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);

          return (
            <Pressable
              onPress={() => onSelectItem(item)}
              key={index}
              style={[
                styles.outlineButton,
                {
                  backgroundColor,
                },
              ]}
            >
              <Text style={[styles.outlineButtonText, { color }]}>
                {capitaliz(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorsFilters = ({ data, filters, setFilters, filterName }) => {
  const onSelectItem = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let borderColor = isActive ? theme.colors.neutral(0.4) : "white";

          return (
            <Pressable onPress={() => onSelectItem(item)} key={index}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { gap: 8 },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  outlineButton: {
    borderWidth: 1,
    borderRadius: theme.radius.xs,
    padding: 8,
    paddingHorizontal: 14,
    borderCurve: "continuous",
  },
  outlineButtonText: {},
  colorWrapper: {
    borderWidth: 2,
    borderRadius: theme.radius.sm,
    padding: 3,
    borderCurve: "continuous",
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
});
