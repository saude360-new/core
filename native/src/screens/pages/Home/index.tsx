import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { BlurView } from 'expo-blur'; // npm install @react-native-community/blur


export default function Home() {

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image source={require('../../../imgs/usuario.png')} style={styles.userIcon} />
        <Text style={styles.headerTitle}>Olá João!</Text>
      </View>

      {/* Botões verticais */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../../../imgs/coracao.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Frequência cardíaca</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require('../../../imgs/termometro.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Temperatura</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require('../../../imgs/saturacao.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Saturação de oxigênio</Text>
        </TouchableOpacity>
      </View>
      
      {/* Avisos */}
      <Text style={styles.avisosTitulo}>Avisos</Text>
      <TouchableOpacity style={styles.alertCard}>
        <Image source={require('../../../imgs/termometro.png')} style={styles.alertIcon} />
        <Text style={styles.alertText}>Temperatura</Text>
      </TouchableOpacity> 
      
       {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Image source={require('../../../imgs/home.png')} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../../imgs/engrenagem.png')} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
