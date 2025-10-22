//importa o tipode navegação que usaremos
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Welcome from '../pages/Welcome' //importa a pagina de boas vindas
import SingIn from '../pages/SignIn' //importa a pagina de Login 
import RecuperarSenhaOne from '../pages/RecuperarSenhaOne' // importa a pagina de recuperar senha
import Home from '../pages/Home' // importa a pagina de Home
import Freq_Cardiaca from '../pages/SinaisVitais/Fresquencia_cardiaca'
import Saturacao from '../pages/SinaisVitais/Saturacao'
import Temperatura from '../pages/SinaisVitais/Temperatura'


const Stack = createNativeStackNavigator();

// configura nossas rotas
export default function Routes(){
    //retorna um componente(retorna nossa stack )
    return(
        <Stack.Navigator>
            <Stack.Screen // cada tela
                name="Welcome" 
                component={Welcome} //componente que é rendenizado
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SignIn"
                component={SingIn}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="RecuperarSenhaOne"
                component={RecuperarSenhaOne}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Home"
                component={Home} 
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Freq_Cardiaca"
                component={Freq_Cardiaca} 
                options={{ headerShown: false }}
            />
            
            <Stack.Screen
                name="Saturacao"
                component={Saturacao} 
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Temperatura"
                component={Temperatura} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}