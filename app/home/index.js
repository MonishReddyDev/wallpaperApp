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
import { useRouter } from "expo-router";

var page = 1;
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const searchRefinput = useRef();
  const [filters, setFilters] = useState(null);
  const [images, setImages] = useState([]);
  const router = useRouter();
  const [activeCategory, setactiveCategory] = useState(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    console.log("Params", params, append);
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
    if (filters) {
      (page = 1), setImages([]);
      let params = { page, ...filters };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const resetFilters = () => {
    console.log("Resetting Filters");
    setFilters(null);
    closeFilterModal();
  };

  const handleChangeCategory = (category) => {
    setactiveCategory(category);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (category) params.category = activeCategory;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    // console.log("Searching for:", text, ...filters);
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setactiveCategory(null); //set setactiveCategory to null when searching
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      page = 1;
      searchRefinput?.current?.clear();
      setImages([]);
      setactiveCategory(null); //set setactiveCategory to null when searching
      fetchImages({ page, ...filters }, false);
    }
  };

  const openFilterModal = () => {
    modalRef.current.present();
  };

  const closeFilterModal = () => {
    modalRef.current.close();
  };

  const clearThisFilterKey = (filterName) => {
    // console.log("filter deleted:", filterName);
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.Categories = activeCategory;
    fetchImages(params, false);
  };

  const clearSearch = () => {
    setSearch("");
    searchRefinput?.current?.clear();
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrolloffset = event.nativeEvent.contentOffset.y;
    const bottonPosition = contentHeight - scrollViewHeight;

    if (scrolloffset >= bottonPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log(" reached bottom");
        /// fetch images
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      } else if (isEndReached) {
        setIsEndReached(false);
      }
    }
  };
  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const hanldeTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/*Header */}
      <View style={styles.Header}>
        <Pressable onPress={handleScrollUp}>
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

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5} //how offten the scrolling event will fire while scrolling(in ms)
        contentContainerStyle={{ gap: 15, borderWidth: 0 }}
        ref={scrollRef}
      >
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
          {/* filter section */}
          {filters && (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {Object.keys(filters).map((key, index) => {
                  return (
                    <View key={key} style={styles.filterItem}>
                      {key == "colors" ? (
                        <View
                          style={{
                            height: 20,
                            width: 30,
                            borderRadius: 7,
                            backgroundColor: filters[key],
                          }}
                        ></View>
                      ) : (
                        <Text style={styles.filterItemText}>
                          {filters[key]}
                        </Text>
                      )}

                      <Pressable
                        onPress={() => clearThisFilterKey(key)}
                        style={styles.filterCloseIcon}
                      >
                        <Ionicons
                          name="close"
                          size={14}
                          color={theme.colors.neutral(0.9)}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {/* Masonry grid*/}
          <View>
            {images.length > 0 && (
              <ImagesGrid images={images} router={router} />
            )}
          </View>
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
  filters: {
    gap: 10,
    paddingHorizontal: wp(4),
  },
  filterItem: {
    marginTop: 10,
    backgroundColor: theme.colors.grayBG,
    padding: 3,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: theme.radius.xs,
    padding: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  filterItemText: {
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});

export default HomeScreen;
