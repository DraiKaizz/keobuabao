// App.tsx
import * as React from 'react';
import { NavigationIndependentTree, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import SessionScreen from '../screens/PlayBot';
import PvsPScreen from '../screens/PvsP';

export type RootStackParamList = {
  Home: undefined;
  Session: undefined;
  PvsP: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationIndependentTree>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} // Ẩn header
          />

          <Stack.Screen 
            name="Session" 
            component={SessionScreen} 
            options={{ headerShown: false }}
            />

          <Stack.Screen 
            name="PvsP" 
            component={PvsPScreen} 
            options={{ headerShown: false }}
            />
        </Stack.Navigator>
    </NavigationIndependentTree>
  );
}
