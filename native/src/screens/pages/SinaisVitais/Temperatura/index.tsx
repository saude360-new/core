import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { BlurView } from 'expo-blur'; // npm install @react-native-community/blur


export default function Temperatura() {

  return (
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Image source={require('../../../imgs/home.png')} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../../imgs/engrenagem.png')} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
  );
}