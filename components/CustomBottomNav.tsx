import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
const CustomBottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const getNavItems = () => {
    const baseItems = [
      { icon: '🏠', label: 'Home', route: 'home' },
      { icon: '🔍', label: 'Explore', route: 'search' },
      { icon: '🎬', label: 'Shorts', route: 'shorts' },
      { icon: '💼', label: 'Opportunities', route: 'opportunities' },
    ];

    // Add role-specific items
    if (user?.role === 'teacher') {
      baseItems.splice(1, 0, { 
        icon: '👨‍🏫', 
        label: 'Dashboard', 
        route: 'teacher-dashboard' 
      });
    } else if (user?.role === 'authenticator' || user?.role === 'admin') {
      baseItems.splice(1, 0, { 
        icon: '🔍', 
        label: 'Moderate', 
        route: 'authenticator-moderation' 
      });
    }

    // Add common items
    baseItems.push(
      { icon: '📊', label: 'Wellbeing', route: 'digital-wellbeing' },
      { icon: '👤', label: 'Profile', route: 'profile' }
    );

    return baseItems;
  };

  const buildNavItem = (icon: string, label: string, route: string) => {
    const isSelected = pathname === `/(tabs)/${route}`;

    return (
      <TouchableOpacity
        key={route}
        style={styles.navItem}
        onPress={() => router.push(`/(tabs)/${route}` as any)}
      >
        <View style={[
          styles.iconContainer,
          isSelected && styles.selectedIconContainer
        ]}>
          <Text style={[
            styles.icon,
            isSelected && styles.selectedIcon
          ]}>
            {icon}
          </Text>
        </View>
        <Text style={[
          styles.label,
          isSelected && styles.selectedLabel
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const navItems = getNavItems();

  return (
    <View style={styles.container}>
      {/* Floating Action Button for Add Post */}
      {pathname === '/(tabs)/home' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-posts')}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.navBar}>
        {navItems.map((item) => 
          buildNavItem(item.icon, item.label, item.route)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  icon: {
    fontSize: 24,
    color: '#666666',
  },
  selectedIcon: {
    fontSize: 26,
    color: '#667EEA',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  selectedLabel: {
    color: '#667EEA',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    backgroundColor: '#667EEA',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  fabIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CustomBottomNav;