import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './src/screens/routes';
import TelaCadastro from './src/screens/pages/SignIn';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './src/screens/pages/Welcome';
import Toast from 'toastify-react-native';


const App = () => {
  return (
    <NavigationContainer>
        <Routes />
        <Toast />
     </NavigationContainer>
  );
};


export default App;