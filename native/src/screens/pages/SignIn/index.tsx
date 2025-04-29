import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../../../lib/http';

export default function TelaCadastro() {
  const [state, setState] = useState({
    firstName: 'Burro' as string | null,
    lastName: 'null' as string | null,
    birthDate: '2008-03-31' as string | null,
    emailAddress: null as string | null,
    userRole: 'caregiver' as string,
    password: '16578950' as string | null,
    gender: 'male' as string,
  });


  async function userConnect() {
    const payload = {
      firstName: state.firstName,
      lastName: state.lastName,
      birthDate: state.birthDate,
      emailAddress: state.emailAddress,
      userRole: state.userRole,
      password: state.password,
      gender: state.gender,
    }; // TODO: encrypt and sign payload before send to the server

    try {
      const res = await fetch('http://10.80.120.100:2602/users', {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(payload),
        method: 'POST',
      });

      if(res.status !== 201) {
        // TODO: show a error message to the stupid
        throw {};
      }

      // TODO: redirect to somewhere
    } catch (err: unknown) {
      console.log(err);
    }
  }


  return (
    <ScrollView contentContainerStyle={estilos.container}>
      {/* Parte 1 */}
      <Text style={estilos.label}>Nome</Text>
      <TextInput style={estilos.input} placeholder="seu nome" />

      <Text style={estilos.label}>Sobrenome</Text>
      <TextInput style={estilos.input} placeholder="seu sobrenome" />

      <Text style={estilos.label}>Data de Nascimento</Text>
      <TextInput style={estilos.input} placeholder="--/--/----" />

      <Text style={estilos.label}>Gênero</Text>
      <View style={estilos.picker}>
        <Picker
          selectedValue={state.gender}
          onValueChange={gender => void setState(prev => ({ ...prev, gender }))}
        >
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
          <Picker.Item label="Não Binário" value="Não Binário" />
        </Picker>
      </View>

      <Text style={estilos.label}>E-mail</Text>
      <TextInput style={estilos.input} onChangeText={emailAddress => {
        setState(prev => ({ ...prev, emailAddress }));
      }} placeholder="seuemail@email.com" />

      {/* Parte 2 */}
      <Text style={estilos.label}>Senha</Text>
      <TextInput style={estilos.input} placeholder="sua senha" secureTextEntry />

      <Text style={estilos.label}>Confirmar Senha</Text>
      <TextInput style={estilos.input} placeholder="confirme sua senha" secureTextEntry />

      <Text style={estilos.label}>Selecione sua classe</Text>
      <View style={estilos.classeContainer}>
        <TouchableOpacity
          style={[estilos.botaoClasse, state.userRole === 'patient' ? estilos.classeAtiva : {}]}
          onPress={() => void setState(prev => ({ ...prev, userRole: 'patient' }))}
        >
          <Text style={estilos.textoBotaoClasse}>Paciente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoClasse, state.userRole === 'caregiver' ? estilos.classeAtiva : {}]}
          onPress={() => void setState(prev => ({ ...prev, userRole: 'caregiver' }))}
        >
          <Text style={estilos.textoBotaoClasse}>Cuidador</Text>
        </TouchableOpacity>
      </View>

      {/* Parte 3 (só aparece se for Cuidador) */}
      {state.userRole === 'caregiver' && (
        <>
          <Text style={estilos.label}>Nome do Paciente</Text>
          <TextInput style={estilos.input} placeholder="nome do paciente" />

          <Text style={estilos.label}>ID do Paciente</Text>
          <TextInput style={estilos.input} placeholder="ID do paciente" />
        </>
      )}

      <TouchableOpacity style={estilos.botaoFinal} onPress={userConnect}>
        <Text style={estilos.textoBotaoFinal}>Cria conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 1,
    paddingBottom: 48,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    overflow: 'hidden',
  },
  classeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  botaoClasse: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  classeAtiva: {
    backgroundColor: '#000',
  },
  textoBotaoClasse: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoFinal: {
    backgroundColor: '#4B4DED',
    padding: 16,
    borderRadius: 6,
    marginTop: 24,
  },
  textoBotaoFinal: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
