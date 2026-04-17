import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignInOptionsScreen from '../screens/SignInOptionsScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import AccommodationTypeScreen from '../screens/AccommodationTypeScreen';
import AccommodationDetailsScreen from '../screens/AccommodationDetailsScreen';
import LifestyleScreen from '../screens/LifestyleScreen';
import LookingForScreen from '../screens/LookingForScreen.js';
import CreateProfileScreen from '../screens/CreateProfileScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignInOptions" component={SignInOptionsScreen} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        <Stack.Screen name="LookingFor" component={LookingForScreen} />
        <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
        <Stack.Screen name="AccommodationType" component={AccommodationTypeScreen} />
        <Stack.Screen name="AccommodationDetails" component={AccommodationDetailsScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        <Stack.Screen name="Main" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}