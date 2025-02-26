import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f1',
  },
  searchInput: {
    flex: 1,
    borderColor: '#d1c6b1',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f1',
    padding: 16,
  },
  title: {
    fontSize: 32,
    color: '#5e4b3c',
    marginBottom: 32,
  },
  switchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchText: {
    color: '#5e4b3c',
    marginRight: 8,
  },
  switchButton: {
    width: 40,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#d1c6b1',
    justifyContent: 'center',
    padding: 2,
  },
  switchCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#af4c4c',
    position: 'absolute',
    left: 2,
  },
  switchCircleActive: {
    left: 22,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#e5ded1',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formContainer: {
    marginBottom: 16,
  },
  formHeader: {
    fontSize: 24,
    color: '#5e4b3c',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f5f5f1',
    borderColor: '#d1c6b1',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    color: '#5e4b3c',
  },
});

export default styles;
