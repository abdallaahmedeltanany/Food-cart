import CartButton from "@/components/CartButton";
import Filter from "@/components/Filter";
import MenuItemCard from "@/components/MenuItemCard";
import SearchBar from "@/components/SearchBar";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppWrite";
import { MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { query, category } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();
  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: {
      category,
      query,
    },
  });
  const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ query, category });
  }, [query, category]);
  if (loading) {
    return (
      <ActivityIndicator
        size={"large"}
        color="#FE8C00"
        className="text-center flex-1 "
      />
    );
  }
  return (
    <SafeAreaView
      className=" background: #FAFAFA;
 h-full"
    >
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;

          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isFirstRightColItem ? "mt-10" : null
              )}
            >
              <MenuItemCard item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="px-5 gap-7 pb-32"
        ListHeaderComponent={() => {
          return (
            <View className="my-5 gap-5">
              <View className="flex-row flex-between w-full">
                <View className="flex-start">
                  <Text className="small-bold text-primary">search</Text>
                  <View className="flexx-start flex-row gap-x-1 mt-0.5">
                    <Text className="paragraph-semibold text-dark-100">
                      find your favorite food
                    </Text>
                  </View>
                </View>
                <CartButton />
              </View>
              <SearchBar />
              <Filter
                categories={
                  categories
                    ? categories.map((cat: any) => ({
                        name: cat.name,
                        description: cat.description,
                        ...cat,
                      }))
                    : []
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={() => !loading && <Text>no results</Text>}
      />
    </SafeAreaView>
  );
};

export default Search;
