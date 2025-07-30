import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
const SearchBar = () => {
  const searchParams = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(searchParams.query);

  const handleSearch = (enteredText: string) => {
    setSearch(enteredText);
    if (!enteredText) router.setParams({ query: undefined });

    setTimeout(() => {
      router.setParams({ query: enteredText });
    }, 5000);
  };
  // const handleSubmitSearch = () => {
  //   if (search?.trim()) router.setParams({ query: search });
  // };
  return (
    <View
      className="search-bar flex-row items-center justify-between border border-white rounded-full px-4 bg-white"
      style={{ elevation: 5, shadowOffset: { height: 5, width: 5 } }}
    >
      <TextInput
        value={search}
        onChangeText={handleSearch}
        // onSubmitEditing={handleSubmitSearch}
        placeholder="Search for any food "
        className="w-[80%] base-bold"
      />
      <Ionicons name="search" size={20} color="#878787" />
    </View>
  );
};

export default SearchBar;
