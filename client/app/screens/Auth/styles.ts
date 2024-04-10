import { StyleSheet } from 'react-native';
import { primaryColor } from '../../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  Text: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 50,
  },
  formContainer: {
    marginTop: 50,
    width: '80%',
  },
  inputContainer: {
    fontSize: 20,
    marginBottom: 20,
    paddingStart: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    height: 50,
  },
  button: {
    marginBottom: 50,
    backgroundColor: primaryColor,
    borderRadius: 30,
    width: '100%',
    height: 50,
  },
});
