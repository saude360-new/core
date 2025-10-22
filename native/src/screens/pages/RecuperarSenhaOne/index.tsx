// src/screens/pages/RecuperarSenhaOne/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import estilos from './styles';
// Importa o Toast para exibir mensagens de feedback ao usuário
import { Toast } from 'toastify-react-native';

export default function RecuperarSenhaOne() {
  const navigation = useNavigation();  //redirecionamento de telas
  //useState para armazenar o email digitado pelo usuario
  const [email, setEmail] = useState('');
  // Função para enviar o e-mail de recuperação
  // Utiliza fetch para enviar uma requisição POST ao servidor com o e-mail do usuário      
  async function handleEnviarEmail() {
    // Verifica se o e-mail está vazio ou inválido
    if (!email.includes('@') || !email.includes('.')) {
      Toast.warn('Informe um e-mail válido.');
      return;
    }
    // Tenta enviar o e-mail para o servidor
    // Se a requisição falhar, exibe uma mensagem de erro
    try {
      // URL do servidor onde a requisição será enviada
      // Aqui, estamos enviando uma requisição POST para o endpoint de recuperação de senha
      const res = await fetch('http://192.168.3.131:2602/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      // Converte a resposta em JSON
      // Se a resposta não for ok, exibe uma mensagem de erro
      const data = await res.json();
      // Verifica se a resposta foi bem-sucedida
      // Se não, exibe uma mensagem de erro com o motivo
      if (!res.ok) {
        Toast.error(data.message || 'E-mail não encontrado.');
        return;
      }
      // Se tudo estiver certo, exibe uma mensagem de sucesso e navega para a próxima tela
      // Navega para a tela de recuperação de código, passando o e-mail como parâmetro
      Toast.success('Código enviado para o e-mail!');
      navigation.navigate('RecuperarSenhaCodigo', { email });
    } catch (err) {
      Toast.error('Erro de conexão.');
    }
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.logo}>Smart <Text style={estilos.logoAzul}>HEALTH</Text></Text>
      <Image
        style={estilos.imagemCadeado}
        source={require('../../../imgs/cadeado.png')}
        />
      <View style={estilos.card}>
        <Text style={estilos.titulo}>Esqueceu sua senha?</Text>
        <Text style={estilos.subtitulo}>Informe seu e-mail para receber o código de recuperação.</Text>
        <TextInput
          style={estilos.input}
          placeholder="E-mail"
          // Define o valor do input como o estado do email
          value={email}
          // Atualiza o estado do email quando o usuário digita
          onChangeText={setEmail}
          // Define o estilo do input
          autoCapitalize="none"
          // Define o tipo de teclado para e-mail
          keyboardType="email-address"
        />
        <TouchableOpacity style={estilos.botao} onPress={handleEnviarEmail}>
          <Text style={estilos.textoBotao}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
