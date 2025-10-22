import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  
   bottomBar: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  bottomIcon: {
    width: 26,
    height: 26,
  },


});