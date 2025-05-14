import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import { Toast } from 'toastify-react-native';

import estilos from './styles'
import { fetchWithTimeout } from '../../../lib/http';

export default function TelaCadastro() {
    const scrollRef = useRef<ScrollView>(null)

    const [state, setState] = useState({
        firstName: null as string | null,
        lastName: null as string | null,
        birthDate: new Date(new Date().getFullYear(), 0, 1),
        emailAddress: null as string | null,
        userRole: 'patient' as string,
        password: null as string | null,
        passwordConfirm: null as string | null,
        gender: 'male' as string,
        showDatePicker: false,
        isKeyboardVisible: false,
    });

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setState(prev => ({
                ...prev,
                isKeyboardVisible: true
            }))

            scrollRef.current?.scrollToEnd()
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

    function toggleDatePicker() {
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                showDatePicker: !prev.showDatePicker
            }));
        }, 100)
    }

    function onDateChange({ type }: { type: string }, birthDate?: Date) {
        if (type !== 'set') return toggleDatePicker();

        if (birthDate) {
            setState(prev => ({
                ...prev,
                birthDate,
                showDatePicker: false
            }));
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
        };

        for (const value of Object.values(payload)) {
            if (!value) {
                Toast.warn("Um ou mais campos obrigatóris estão vazios");
                return;
            }
        }

        if (state.password !== state.passwordConfirm) {
            Toast.error('As senhas não coincidem');
            return;
        }

        try {
            const res = await fetchWithTimeout('http://10.8.14.15:2602/users', {
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
            Toast.error('Erro de conexão com o servidor: ' + err.message);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={estilos.container}
                    ref={scrollRef}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={estilos.titulo}>
                        <Text style={estilos.tituloNegrito}>Smart</Text>
                        <Text style={estilos.tituloAzul}>HEALTH</Text>
                    </View>

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
                        <TouchableOpacity onPress={toggleDatePicker}>
                            <TextInput
                                style={estilos.input}
                                value={state.birthDate.toLocaleDateString('pt-BR')}
                                editable={false}
                            />
                        </TouchableOpacity>
                        {state.showDatePicker ? (
                            <DatePicker
                                value={state.birthDate}
                                mode="date"
                                display="calendar"
                                onChange={onDateChange}
                            />
                        ) : null}
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

                    {state.userRole === 'caregiver' ? (
                        <>
                            <Text style={estilos.label}>Nome do Paciente</Text>
                            <TextInput style={estilos.input} placeholder="nome do paciente" />

                            <Text style={estilos.label}>ID do Paciente</Text>
                            <TextInput style={estilos.input} placeholder="ID do paciente" />
                        </>
                    ) : null}

                    <TouchableOpacity
                        onPress={userConnect}
                        style={{
                            ...estilos.botaoFinal,
                            marginBottom: state.isKeyboardVisible ?
                                state.userRole === 'caregiver' ?
                                    35 :
                                    200 :
                                estilos.botaoFinal.marginBottom
                        }}
                    >
                        <Text style={estilos.textoBotaoFinal}>Criar conta</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


