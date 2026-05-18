import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInOptionsScreen from '../screens/SignInOptionsScreen';
import AuthScreen from '../screens/AuthScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import AccommodationTypeScreen from '../screens/AccommodationTypeScreen';
import AccommodationDetailsScreen from '../screens/AccommodationDetailsScreen';
import LifestyleScreen from '../screens/LifestyleScreen';
import LookingForScreen from '../screens/LookingForScreen.js';
import AccountReadyScreen from '../screens/AccountReadyScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          animationDuration: 550,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignInOptions" component={SignInOptionsScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        <Stack.Screen name="LookingFor" component={LookingForScreen} />
        <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
        <Stack.Screen name="AccommodationType" component={AccommodationTypeScreen} />
        <Stack.Screen name="AccommodationDetails" component={AccommodationDetailsScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        <Stack.Screen name="AccountReady" component={AccountReadyScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ListingDetails" component={ListingDetailsScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={AppTabs} />
        <Stack.Screen name="Search" component={SearchScreen} />
  <Stack.Screen
  name="Map"
  component={MapScreen}
  options={{ headerShown: true, title: 'Back' }}
/>
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}