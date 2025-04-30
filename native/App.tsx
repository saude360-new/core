import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './src/screens/routes';
import TelaCadastro from './src/screens/pages/SignIn';


const App = () => {
  return (
    <View style={styles.container}>
      <TelaCadastro></TelaCadastro>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



export default App;
