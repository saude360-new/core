import { StyleSheet } from 'react-native'


const estilos = StyleSheet.create({
    container: {
      padding: 38,
      width: '100%',
      backgroundColor: '#fff',
    },
    titulo: {
        textAlign: 'left',
        marginBottom: 40,
        paddingTop: 30
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
    input: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        fontSize: 16,
        color: '#000',
        width: '100%',
        backgroundColor: '#efefef',
    },
    picker: {
      overflow: 'hidden',
      marginBottom: 15,
      borderRadius: 16,
      backgroundColor: '#efefef'
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
      marginBottom: 110
    },
    textoBotaoFinal: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
    
  });


  export default estilos