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
import DatePicker from '@react-native-community/datetimepicker'
import { Toast } from 'toastify-react-native';


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
    }))
  }

  function onDateChange({ type }: { type: string }, selectedDate?: Date) {
    if (type !== 'set')
      return toggleDatePicker()

    if (selectedDate) {
      setState(prev => ({
        ...prev,
        birthDate: selectedDate
      }))
    }
  }


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

    // Toast.info('sending request to backend...')

    try {
      const res = await fetch('https://example.com', {
        method: 'GET',
      });

      if (res.status !== 201) {
        throw { cause: `Response status is not 201 [returned ${res.status}]` };
      }

      // TODO: redirect to somewhere
    } catch (err: any) {
      Toast.error(`Request failed due to: ${err.message || err.cause}`)
      console.log(err);
    }
  }


  return (
    <ScrollView contentContainerStyle={estilos.container}>
      {/* Parte 1 */}
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
        onChangeText={lastName => setState(prev => ({ ...prev, firstName: lastName }))}
      />

      <Text style={estilos.label}>Data de Nascimento</Text>
      <View>
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            style={estilos.input}
            placeholder="15 de maio de 2005"
            value={state.birthDate.toLocaleDateString('pt-BR')}
            editable={false}
            onChangeText={value => setState(prev => ({ ...prev, birthDate: new Date(value) }))}
          />
        </Pressable>
        {
          state.showDatePicker ? (
            <DatePicker
              value={state.birthDate}
              mode="date"
              display="calendar"
              onChange={onDateChange}
            />
          ) : null
        }
      </View>

      <Text style={estilos.label}>Gênero</Text>
      <View style={estilos.picker}>
        <Picker
          selectedValue={state.gender}
          onValueChange={gender => void setState(prev => ({ ...prev, gender }))}
        >
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Feminino" value="female" />
        </Picker>
      </View>

      <Text style={estilos.label}>E-mail</Text>
      <TextInput
        style={estilos.input}
        onChangeText={emailAddress => {
          setState(prev => ({ ...prev, emailAddress }));
        }}
        placeholder="seuemail@email.com"
      />

      {/* Parte 2 */}
      <Text style={estilos.label}>Senha</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite sua senha"
        onChangeText={password => {
          setState(prev => ({
            ...prev,
            password
          }))
        }}
        secureTextEntry 
      />

      <Text style={estilos.label}>Confirmar Senha</Text>
      <TextInput
        style={estilos.input}
        placeholder="Confirme sua senha"
        onChangeText={passwordConfirm => {
          setState(prev => ({
            ...prev,
            password: passwordConfirm
          }))
        }}
        secureTextEntry
      />

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
      {state.userRole === 'caregiver' ? (
        <>
          <Text style={estilos.label}>Nome do Paciente</Text>
          <TextInput style={estilos.input} placeholder="nome do paciente" />

          <Text style={estilos.label}>ID do Paciente</Text>
          <TextInput style={estilos.input} placeholder="ID do paciente" />
        </>
      ) : null}

      <TouchableOpacity style={estilos.botaoFinal} onPress={userConnect}>
        <Text style={estilos.textoBotaoFinal}>Cria conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 30,
    width: '100%',
    display: 'flex',
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
