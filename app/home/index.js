import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImagesGrid from "../../components/ImagesGrid";
import { debounce } from "lodash";
import FiltersModal from "../../components/filtersModal";

var page = 1;
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const searchRefinput = useRef();
  const [filters, setFilters] = useState(null);
  const [images, setImages] = useState([]);
  const [activeCategory, setactiveCategory] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = false) => {
    let res = await apiCall(params);
    // console.log("Got url", res.data?.hits);
    if (res.success && res.data.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
  };

  const applyFilters = () => {
    console.log("Applying Filters");
    closeFilterModal();
  };
  const resetFilters = () => {
    console.log("Resetting Filters");
    closeFilterModal();
  };

  const handleChangeCategory = (category) => {
    setactiveCategory(category);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
    };
    if (category) params.category = category;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    console.log("Searching for:", text);
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setactiveCategory(null); //set setactiveCategory to null when searching
      fetchImages({ page, q: text }, false);
    }
    if (text == "") {
      page = 1;
      searchRefinput?.current?.clear();
      setImages([]);
      setactiveCategory(null); //set setactiveCategory to null when searching
      fetchImages({ page }, false);
    }
  };

  const openFilterModal = () => {
    modalRef.current.present();
  };

  const closeFilterModal = () => {
    modalRef.current.close();
  };

  const clearSearch = () => {
    setSearch("");
    searchRefinput?.current?.clear();
  };
  console.log(filters);

  const hanldeTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/*Header */}
      <View style={styles.Header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFilterModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={{ color: theme.colors.neutral(0.7) }}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: 15, borderWidth: 0 }}>
        {/*Search Bar */}
        <View style={styles.SearchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={22}
              color={theme.colors.neutral(0.9)}
            />
          </View>
          <TextInput
            ref={searchRefinput}
            // value={search}
            onChangeText={hanldeTextDebounce}
            style={styles.Searchinput}
            placeholder="Search for wallpaper"
          />
          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={22}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* Categories Section */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
          {/* Masonry grid*/}
          <View>{images.length > 0 && <ImagesGrid images={images} />}</View>
        </View>
      </ScrollView>
      <FiltersModal
        filters={filters}
        setFilters={setFilters}
        onclose={closeFilterModal}
        onApply={applyFilters}
        onReset={resetFilters}
        modalRef={modalRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  Header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.neutral(0.9),
  },
  SearchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    padding: 6,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 8,
  },
  closeIcon: {
    padding: 8,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
  },
  Searchinput: {
    flex: 1,
    borderRadius: theme.radius.md,
    fontSize: hp(1.8),
  },
  categories: {},
});
export default HomeScreen;
