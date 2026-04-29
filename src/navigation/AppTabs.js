import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text, View } from 'react-native';

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
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#6F6A63',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require('../../assets/icons/home.png')}
              focused={focused}
              color={color}
              label="Home"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require('../../assets/icons/explore.png')}
              focused={focused}
              color={color}
              label="Explore"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require('../../assets/icons/message.png')}
              focused={focused}
              color={color}
              label="Chats"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require('../../assets/icons/profile.png')}
              focused={focused}
              color={color}
              label="Profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ icon, focused, color, label }) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.iconPill, focused && styles.activeIconPill]}>
        <Image source={icon} style={[styles.icon, { tintColor: color }]} />
        <Text style={[styles.iconLabel, { color }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 86,
    borderTopWidth: 1,
    borderTopColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabBarLabel: {
    display: 'none',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    minWidth: 72,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconPill: {
    backgroundColor: '#F4C21A',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});