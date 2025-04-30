import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';


export default function Welcome() {
    const navigate = useNavigation()

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>
        <Text style={estilos.tituloNegrito}>Smart </Text>
        <Text style={estilos.tituloAzul}>HEALTH</Text>
      </Text>

      <Text style={estilos.label}>E-mail</Text>
      <TextInput
        style={estilos.campoInput}
        placeholder="email@provider.xxx"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <Text style={estilos.label}>Senha</Text>
      <TextInput
        style={estilos.campoInput}
        placeholder="Digite a senha"
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={estilos.botao}>
        <Text style={estilos.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={estilos.botao}
        onPress={() => void navigate.navigate('SignIn')}
      >
        <Text style={estilos.textoBotao}>Cria conta</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={estilos.esqueciSenha}>Esqueceu a senha ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
    display: 'flex'
  },
  titulo: {
    fontSize: 28,
    marginBottom: 40,
    textAlign: 'left',
  },
  tituloNegrito: {
    fontWeight: 'bold',
    color: '#000',
  },
  tituloAzul: {
    color: '#4B4DED',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  campoInput: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
    width: '100%'
  },
  botao: {
    backgroundColor: '#4B4DED',
    padding: 14,
    borderRadius: 4,
    marginTop: 8,
  },
  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  esqueciSenha: {
    marginTop: 16,
    color: '#000',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
