import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Define Colors if not available
const Colors = {
  primaryColor: '#000000',
  secondaryColor: '#666666',
  mobileBackgroundColor: '#FFFFFF',
  mobileSearchColor: '#F2F2F7',
  blueColor: '#007AFF',
};

// Mock data
const DemoData = {
  demoUsers: [
    {
      id: '1',
      username: 'John Doe',
      userType: 'Developer',
      photoUrl: { uri: 'https://via.placeholder.com/40' }
    },
    {
      id: '2',
      username: 'Jane Smith',
      userType: 'Designer',
      photoUrl: { uri: 'https://via.placeholder.com/40' }
    },
    {
      id: '3',
      username: 'Mike Johnson',
      userType: 'Product Manager',
      photoUrl: { uri: 'https://via.placeholder.com/40' }
    },
    {
      id: '4',
      username: 'Sarah Wilson',
      userType: 'Flutter Developer',
      photoUrl: { uri: 'https://via.placeholder.com/40' }
    },
    {
      id: '5',
      username: 'Alex Brown',
      userType: 'React Native Developer',
      photoUrl: { uri: 'https://via.placeholder.com/40' }
    },
  ]
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Flutter', 'React Native', 'Internship']);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const results = DemoData.demoUsers.filter(user =>
        user.username.toLowerCase().includes(text.toLowerCase()) ||
        user.userType.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserPress = (user: any) => {
    Alert.alert(
      `Visit ${user.username}'s Profile`,
      `Would you like to view ${user.username}'s profile?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Profile', onPress: () => {
          // Navigate to user profile
          console.log('Navigate to user profile:', user.username);
        }}
      ]
    );
  };

  const handleFollow = (username: string) => {
    Alert.alert('Follow', `You started following ${username}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    Alert.alert('Cleared', 'Recent searches have been cleared');
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.userItem} 
      onPress={() => handleUserPress(item)}
    >
      <Image source={item.photoUrl} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.userType}>{item.userType}</Text>
      </View>
      <TouchableOpacity 
        style={styles.followButton}
        onPress={() => handleFollow(item.username)}
      >
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRecentSearches = () => (
    <View style={styles.recentSearches}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={clearRecentSearches}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      {recentSearches.length > 0 ? (
        <View style={styles.recentTags}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentTag}
              onPress={() => handleSearch(search)}
            >
              <Text style={styles.recentTagText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No recent searches</Text>
        </View>
      )}
    </View>
  );

  const renderSearchResults = () => {
    if (searchResults.length === 0 && searchQuery.length > 0) {
      return (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No users found for &quot;{searchQuery}&quot;</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={searchResults}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for users, posts, opportunities..."
            placeholderTextColor={Colors.secondaryColor}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.length === 0 ? renderRecentSearches() : renderSearchResults()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  searchBarContainer: {
    padding: 16,
    backgroundColor: Colors.mobileBackgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mobileSearchColor,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mobileSearchColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.secondaryColor,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    color: Colors.primaryColor,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  recentSearches: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  clearText: {
    color: Colors.blueColor,
    fontSize: 14,
    fontWeight: '500',
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentTag: {
    backgroundColor: Colors.mobileSearchColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  recentTagText: {
    color: Colors.primaryColor,
    fontSize: 14,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.secondaryColor,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mobileSearchColor,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.mobileSearchColor,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    color: Colors.primaryColor,
    marginBottom: 2,
    fontWeight: '500',
  },
  userType: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  followButton: {
    backgroundColor: Colors.blueColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  followText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SearchScreen;