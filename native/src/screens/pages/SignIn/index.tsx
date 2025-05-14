import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import { Toast } from 'toastify-react-native';

import estilos from './styles'

export default function TelaCadastro() {
  const [state, setState] = useState({
    firstName: null as string | null,
    lastName: null as string | null,
    birthDate: new Date(new Date().getFullYear() - 19, 1, 1),
    emailAddress: null as string | null,
    userRole: 'patient' as string,
    password: null as string | null,
    passwordConfirm: null as string | null,
    gender: 'male' as string,
    showDatePicker: false,
  });

  function toggleDatePicker() {
    setState(prev => ({
      ...prev,
      showDatePicker: !prev.showDatePicker
    }));
  }

  function onDateChange({ type }: { type: string }, selectedDate?: Date) {
    if (type !== 'set') return toggleDatePicker();

    if (selectedDate) {
      setState(prev => ({
        ...prev,
        birthDate: selectedDate
      }));
    }
  }

  async function userConnect() {
    if (state.password !== state.passwordConfirm) {
      Toast.error('As senhas não coincidem');
      return;
    }

    const payload = {
      firstName: state.firstName,
      lastName: state.lastName,
      birthDate: state.birthDate,
      emailAddress: state.emailAddress,
      userRole: state.userRole,
      password: state.password,
      gender: state.gender,
    };

    try {
      const res = await fetch('http://192.168.3.160:2602/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        
        Toast.success('Conta criada com sucesso!');
      } else {
        const error = await res.json();
        Toast.error(error.message || 'Erro ao criar conta.');
      }
    } catch (err) {
      Toast.error('Erro de conexão com o servidor.');
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.label}>Nome</Text>
      <TextInput
        style={estilos.input}
        placeholder="seu nome"
        onChangeText={firstName => setState(prev => ({ ...prev, firstName }))}
      />

      <Text style={estilos.label}>Sobrenome</Text>
      <TextInput
        style={estilos.input}
        placeholder="seu sobrenome"
        onChangeText={lastName => setState(prev => ({ ...prev, lastName }))}
      />

      <Text style={estilos.label}>Data de Nascimento</Text>
      <View>
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            style={estilos.input}
            placeholder="15 de maio de 2005"
            value={state.birthDate.toLocaleDateString('pt-BR')}
            editable={false}
          />
        </Pressable>
        {state.showDatePicker && (
          <DatePicker
            value={state.birthDate}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        )}
      </View>

      <Text style={estilos.label}>Gênero</Text>
      <View style={estilos.picker}>
        <Picker
          selectedValue={state.gender}
          onValueChange={gender => setState(prev => ({ ...prev, gender }))}
        >
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Feminino" value="female" />
        </Picker>
      </View>

      <Text style={estilos.label}>E-mail</Text>
      <TextInput
        style={estilos.input}
        placeholder="seuemail@email.com"
        onChangeText={emailAddress => setState(prev => ({ ...prev, emailAddress }))}
      />

      <Text style={estilos.label}>Senha</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite sua senha"
        secureTextEntry
        onChangeText={password => setState(prev => ({ ...prev, password }))}
      />

      <Text style={estilos.label}>Confirmar Senha</Text>
      <TextInput
        style={estilos.input}
        placeholder="Confirme sua senha"
        secureTextEntry
        onChangeText={passwordConfirm => setState(prev => ({ ...prev, passwordConfirm }))}
      />

      <Text style={estilos.label}>Selecione sua classe</Text>
      <View style={estilos.classeContainer}>
        <TouchableOpacity
          style={[estilos.botaoClasse, state.userRole === 'patient' ? estilos.classeAtiva : {}]}
          onPress={() => setState(prev => ({ ...prev, userRole: 'patient' }))}
        >
          <Text style={estilos.textoBotaoClasse}>Paciente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoClasse, state.userRole === 'caregiver' ? estilos.classeAtiva : {}]}
          onPress={() => setState(prev => ({ ...prev, userRole: 'caregiver' }))}
        >
          <Text style={estilos.textoBotaoClasse}>Cuidador</Text>
        </TouchableOpacity>
      </View>

      {state.userRole === 'caregiver' && (
        <>
          <Text style={estilos.label}>Nome do Paciente</Text>
          <TextInput style={estilos.input} placeholder="nome do paciente" />

          <Text style={estilos.label}>ID do Paciente</Text>
          <TextInput style={estilos.input} placeholder="ID do paciente" />
        </>
      )}

      <TouchableOpacity style={estilos.botaoFinal} onPress={userConnect}>
        <Text style={estilos.textoBotaoFinal}>Criar conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


