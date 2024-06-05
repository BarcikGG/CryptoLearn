import React from 'react';
import { TextInput, Animated, StyleSheet } from 'react-native';

interface Props {
    searchOpacity: any,
    searchText: string,
    setSearchText: any
}

const SearchBar = ({ searchOpacity, searchText, setSearchText }: Props) => {
  return (
    <Animated.View style={[styles.searchContainer, { opacity: searchOpacity }]}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по заголовку"
        onChangeText={setSearchText}
        value={searchText}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    height: 60
  },
  searchInput: {
    height: 40,
    width: '90%',
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default SearchBar;
