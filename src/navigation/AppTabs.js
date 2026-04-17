import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/icons/home.png')}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/icons/explore.png')}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/icons/message.png')}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/icons/profile.png')}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ icon, focused }) {
  return (
    <View style={[styles.iconWrap, focused && styles.activeIcon]}>
      <Image source={icon} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingTop: 8,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    backgroundColor: '#F4C21A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});