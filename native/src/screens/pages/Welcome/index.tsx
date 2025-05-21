import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';

import estilos from './styles'
import { Toast } from 'toastify-react-native';
import { fetchWithTimeout } from '../../../lib/http';


export default function Welcome() {
    const navigate = useNavigation();

    const [state, setState] = useState({
        emailAddress: null as string | null,
        password: null as string | null,
        isKeyboardVisible: false
    });

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setState(prev => ({
                ...prev,
                isKeyboardVisible: true
            }))
        });
    
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setState(prev => ({
              ...prev,
              isKeyboardVisible: false
          }))
        });
    
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);

    async function onSignIn() {
        const payload = {
            email: state.emailAddress,
            password: state.password,
        };

        for(const value of Object.values(payload)) {
            if(!value) {
                Toast.warn("Um ou mais campos obrigatóris estão vazios");
                return;
            }
        }

        try {
            const res = await fetchWithTimeout('http://192.168.3.160:2602/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            Toast.error('Erro de conexão com o servidor: ' + err.message);
        }
    }

    return (
        <View
            style={{
                ...estilos.container,
                paddingBottom: state.isKeyboardVisible ? 150 : undefined
            }}
        >
            <View style={estilos.titulo}>
                <Text style={estilos.tituloNegrito}>Smart</Text>
                <Text style={estilos.tituloAzul}>HEALTH</Text>
            </View>

            <View style={estilos.borderView}>
                <Text style={estilos.label}>E-mail</Text>
                <TextInput
                    style={estilos.campoInput}
                    placeholder="SmartHealth@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#a1a1a1"
                    onChangeText={emailAddress => setState(prev => ({ ...prev, emailAddress }))}
                />

                <Text style={estilos.label}>Senha</Text>
                <TextInput
                    style={estilos.campoInput}
                    placeholder="Digite a senha"
                    placeholderTextColor="#a1a1a1"
                    secureTextEntry
                    onChangeText={password => setState(prev => ({ ...prev, password }))}
                />

                <TouchableOpacity
                    style={estilos.botaoEntrar}
                    onPress={onSignIn}
                >
                    <Text style={estilos.textoBotao}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={estilos.botaoCadastrar}
                    onPress={() => void navigate.navigate('SignIn')}
                >
                    <Text style={estilos.textoBotao}>Cria conta</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={estilos.esqueciSenha}>Esqueceu a senha ?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


