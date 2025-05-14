//importa o tipode navegação que usaremos
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Welcome from '../pages/Welcome' //importa a pagina de boas vindas
import SingIn from '../pages/SignIn' //importa a pagina de Login 

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
        </Stack.Navigator>
    )
}