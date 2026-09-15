import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242b5f" />
      <AppNavigator />
    </>
  );
}
