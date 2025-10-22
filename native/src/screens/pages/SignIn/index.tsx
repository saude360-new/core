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
// Importa o Picker e DatePicker para seleção de gênero e data de nascimento
import { Picker } from '@react-native-picker/picker';
// Importa o componente DatePicker para seleção de data
import DatePicker from '@react-native-community/datetimepicker';
// Importa o Toast para exibir mensagens de feedback ao usuário
import { Toast } from 'toastify-react-native';

import estilos from './styles'
// Importa a função fetchWithTimeout para requisições com timeout
// Esta função é uma abstração para lidar com requisições HTTP com um tempo limite definido
import { fetchWithTimeout } from '../../../lib/http';

export default function TelaCadastro() {
    // Cria uma referência para o ScrollView, que será usada para rolar a tela quando o teclado estiver visível
    const scrollRef = useRef<ScrollView>(null)
    // Define o estado inicial do componente, que inclui campos como nome, sobrenome, data de nascimento, e-mail, senha, etc.
    const [state, setState] = useState({
        firstName: null as string | null,
        lastName: null as string | null,
        // Define a data de nascimento como o primeiro dia do ano atual
        birthDate: new Date(new Date().getFullYear(), 0, 1),
        emailAddress: null as string | null,
        // Define o papel do usuário como paciente por padrão
        userRole: 'patient' as string,
        password: null as string | null,
        passwordConfirm: null as string | null,
        // Define o gênero como masculino por padrão
        gender: 'male' as string,
        patientEmail: 'null' as string,
        // Define se o seletor de data está visível ou não
        showDatePicker: false,
        // Define se o teclado está visível ou não, usado para ajustar o layout da tela
        isKeyboardVisible: false,
    });
    // Efeito para adicionar listeners de teclado para ajustar o layout quando o teclado é exibido ou ocultado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setState(prev => ({
                ...prev,
                isKeyboardVisible: true
            }))
            // Rola o ScrollView para o final quando o teclado é exibido
            // Isso garante que o campo de entrada atual esteja visível
            scrollRef.current?.scrollToEnd()
        });
        // Listener para quando o teclado é ocultado, restaurar o layout original da tela
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setState(prev => ({
                ...prev,
                isKeyboardVisible: false
            }))
        });
        // Remove os listeners quando o componente é desmontado para evitar vazamentos de memória
        // Isso é importante para manter a performance e evitar comportamentos inesperados
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Função para alternar a visibilidade do seletor de data
    // Esta função é chamada quando o usuário toca no campo de data de nascimento
    function toggleDatePicker() {
        setTimeout(() => {
            setState(prev => ({
              // ...prev, // Mantém o estado anterior
                ...prev,
                showDatePicker: !prev.showDatePicker
            }));
            // Rola o ScrollView para o final quando o seletor de data é exibido
        }, 100)
    }
    // Função para lidar com a mudança de data no seletor
    // Esta função é chamada quando o usuário seleciona uma data no DatePicker
    function onDateChange({ type }: { type: string }, birthDate?: Date) {
        // Se o tipo não for 'set', apenas alterna a visibilidade do seletor de data
        // Isso é útil para quando o usuário cancela a seleção de data
        if (type !== 'set') return toggleDatePicker();
        // Se uma data for selecionada, atualiza o estado com a nova data de nascimento
        // Isso garante que o campo de data de nascimento seja atualizado corretamente
        if (birthDate) {
            setState(prev => ({
              // ...prev, // Mantém o estado anterior
                ...prev,
                birthDate,
                // Oculta o seletor de data após a seleção
                showDatePicker: false
            }));
        }
    }
    // Função para conectar o usuário, que é chamada quando o usuário clica no botão de criar conta
    // Esta função valida os campos obrigatórios, verifica se as senhas coincidem e envia
    async function userConnect() {
        const payload = {
            firstName: state.firstName,
            lastName: state.lastName,
            birthDate: state.birthDate,
            emailAddress: state.emailAddress,
            userRole: state.userRole,
            password: state.password,
            gender: state.gender,
            patientEmail: state.patientEmail,
        };
        // Verifica se todos os campos obrigatórios estão preenchidos
        for (const value of Object.values(payload)) {
            if (!value) {
                Toast.warn("Um ou mais campos obrigatóris estão vazios");
                return;
            }
        }
        // Verifica se as senhas coincidem
        if (state.password !== state.passwordConfirm) {
            Toast.error('As senhas não coincidem');
            return;
        }
        // Tenta enviar os dados do usuário para o servidor
        // Utiliza a função fetchWithTimeout para enviar uma requisição POST com os dados do usuário
        // Se a requisição for bem-sucedida, exibe uma mensagem de sucesso
        try {
            const res = await fetchWithTimeout('http://192.168.3.131:2602/users', {
                method: 'POST',
                // Define o cabeçalho Content-Type como application/json
                // Isso informa ao servidor que estamos enviando dados no formato JSON
                headers: {
                    'Content-Type': 'application/json',
                },
                // Converte o payload em uma string JSON para enviar no corpo da requisição
                body: JSON.stringify(payload)
            });
            // Verifica se a resposta foi bem-sucedida
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
        // Renderiza a tela de cadastro
        // Utiliza KeyboardAvoidingView para ajustar o layout quando o teclado é exibido
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            // Define o comportamento do KeyboardAvoidingView dependendo da plataforma
            // No iOS, o comportamento é 'padding', que ajusta o layout para evitar que o teclado cubra os campos de entrada
            // No Android, o comportamento é 'height', que ajusta a altura da tela para acomodar o teclado
            behavior={Platform.OS === "ios" ? "padding" : "height"}

        >   {/* Utiliza TouchableWithoutFeedback para fechar o teclado quando o usuário toca fora dos campos de entrada*/}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {/* Utiliza ScrollView para permitir rolagem quando o teclado está visível */}
                <ScrollView
                    style={estilos.container}
                    // Define a referência do ScrollView para rolagem programática
                    ref={scrollRef}
                    // Define o comportamento de rolagem para lidar com o teclado
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
                        // Define o valor do input como o estado do primeiro nome
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
                                // Define o placeholder como a data de nascimento formatada
                                editable={false}
                            />
                        </TouchableOpacity>
                        {/* Exibe o DatePicker se o estado showDatePicker for verdadeiro*/}
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
                            // Define o estilo do Picker
                            selectedValue={state.gender}
                            // Define a função que será chamada quando o valor do Picker mudar
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
                        // Define o valor do input como o estado do e-mail
                        onChangeText={emailAddress => setState(prev => ({ ...prev, emailAddress }))}
                    />

                    <Text style={estilos.label}>Senha</Text>
                    <TextInput
                        style={estilos.input}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        // Define o valor do input como o estado da senha
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
                        // Define o estilo do botão de classe, aplicando uma classe ativa se o papel do usuário for 'patient'
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
                    {/* Se o papel do usuário for 'caregiver', exibe campos adicionais para o nome e e-mail do paciente */}
                    {/* Isso permite que cuidadores associem um paciente ao criar sua conta */}
                    {state.userRole === 'caregiver' ? (
                        <>
                            <Text style={estilos.label}>Nome do Paciente</Text>
                            <TextInput style={estilos.input} placeholder="nome do paciente" />

                            <Text style={estilos.label}>Email do Paciente</Text>
                            <TextInput style={estilos.input} placeholder="Email do paciente"
                            // Define o valor do input como o estado do e-mail do paciente
                            onChangeText={patientEmail => setState(prev => ({ ...prev, patientEmail }))}
                            />
                        </>
                        // Se o papel do usuário não for 'caregiver', não exibe os campos adicionais
                    ) : null}
                    {/* Botão para criar a conta do usuário */}
                    <TouchableOpacity
                        // Define o estilo do botão de criar conta, ajustando a margem inferior dependendo se o teclado está visível
                        // Isso garante que o botão esteja sempre visível, mesmo quando o teclado está aberto
                        onPress={userConnect}
                        style={{
                            ...estilos.botaoFinal,
                            // Ajusta a margem inferior dependendo do estado do teclado e do papel do usuário
                            // Se o teclado estiver visível, a margem inferior é menor para evitar que o botão seja coberto
                            // Se o usuário for um cuidador, a margem inferior é maior para acomodar o layout
                            // Isso melhora a usabilidade e a experiência do usuário
                            marginBottom: state.isKeyboardVisible ?
                                state.userRole === 'caregiver' ?
                                    35 :
                                    200 :
                                    // Se o teclado não estiver visível, a margem inferior é maior para dar espaço ao botão
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


