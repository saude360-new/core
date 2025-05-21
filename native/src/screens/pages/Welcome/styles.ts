import { StyleSheet } from 'react-native'


const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        width: '100%',
        display: 'flex'
    },
    titulo: {
        textAlign: 'left',
        marginBottom: 40,
        padding: 30
    },
    tituloNegrito: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 36,
    },
    tituloAzul: {
        color: '#414bb2',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: -10
    },
    label: {
        fontSize: 21,
        color: '#333',
        marginBottom: 4,
    },
    campoInput: {
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#000',
        width: '100%',
        backgroundColor: '#efefef',
    },
    botaoEntrar: {
        backgroundColor: '#414bb2',
        padding: 10,
        marginTop: 16,
        borderRadius: 35,
        width: '100%',
        alignSelf: 'center'
    },
    botaoCadastrar: {
        backgroundColor: '#2f2f2f',
        padding: 10,
        marginTop: 16,
        borderRadius: 35,
        width: '100%',
        alignSelf: 'center'
    },
    textoBotao: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 23,
    },
    esqueciSenha: {
        marginTop: 28,
        color: '#414bb2',
        textDecorationLine: 'underline',
        fontSize: 16
    },
    borderView: {
        padding: 30,
        borderStyle: 'solid',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#a1a1a1',
        width: '98%',
        marginLeft: '1%',
        paddingBottom: 10
    }
});


export default estilos;