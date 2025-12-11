// In App.js in a new project
// "main": "node_modules/expo/AppEntry.js",
import * as React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="home">
      <Stack.Screen name="home" />
      <Stack.Screen name="add-task" />
      <Stack.Screen name="add-via-voice" />
      {/* <Stack.Screen name="search" /> */}
    </Stack>
  );
}
