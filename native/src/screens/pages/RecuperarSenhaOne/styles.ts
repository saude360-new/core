import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingTop: 70,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoAzul: {
    color: '#414bb2',
  },
  imagemCadeado: {
    paddingTop: 200,

    width: 180,
    height: 180,
    alignSelf: 'center',
    marginVertical: 20,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 40,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitulo: {
    padding: 10,
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#efefef',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#414bb2',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default estilos;
