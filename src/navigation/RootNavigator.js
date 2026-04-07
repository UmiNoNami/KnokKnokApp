import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import AuthScreen from '../screens/AuthScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInOptionsScreen from '../screens/SignInOptionsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAppState } from '../providers/AppProvider';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.panel,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function RootNavigator() {
  const { isSignedIn } = useAppState();

  return (
    <NavigationContainer theme={navigationTheme}>
      {isSignedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      ) : (
           <Stack.Navigator
  initialRouteName="Welcome"
  screenOptions={{ headerShown: false }}
>
  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  <Stack.Screen name="SignInOptions" component={SignInOptionsScreen} />
  <Stack.Screen name="Auth" component={AuthScreen} />
</Stack.Navigator>
      )}
    </NavigationContainer>
  );
}