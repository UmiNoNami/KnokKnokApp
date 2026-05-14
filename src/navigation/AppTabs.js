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
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 28,
    height: 66,
    borderRadius: 34,
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(233, 233, 233, 0.32)',
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  tabBarLabel: {
    display: 'none',
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconPill: {
    width: 64,
    height: 44,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

activeIconPill: {
  backgroundColor: 'rgba(244, 179, 0, 0.66)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.75)',
  shadowColor: '#F4B400',
  shadowOpacity: 0.18,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
},

  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },

  iconLabel: {
    display: 'none',
  },
});