import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f1' },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
    justifyContent: 'space-between',
  },

  searchInput: { 
    width: '60%',
    borderWidth: 1,
    borderColor: '#d1c6b1',
    borderRadius: 8,
    padding: 8
  },

  keyButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    width: 50,
  },

  logoutButton: { 
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#c2a55c',
    borderRadius: 8,
    width: 80,
  },

  keyPlusIcon: { marginLeft: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  contactList: { padding: 10 },
  contactItem: { padding: 10, backgroundColor: '#e5ded1', marginTop: 5, borderRadius: 8 },
  emptyText: { textAlign: 'center', color: '#aaa' },

  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.7)' 
  },
  modalContent: { 
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10, 
    padding: 30,
    elevation: 5 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15
  },
  modalInput: { 
    borderWidth: 1,
    borderColor: '#d1c6b1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: { 
    padding: 15,
    backgroundColor: '#c2a55c',
    borderRadius: 10,
    marginBottom: 15
  },
  modalButtonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16 
  },

  message: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },

  contactRequest: { 
    padding: 15, 
    backgroundColor: '#f1e6d7',
    borderRadius: 10, 
    marginBottom: 10 
  },
  keyDisplay: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 15 
  },
  keyInput: { 
    height: 50,
    borderWidth: 1,
    borderColor: '#d1c6b1',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  copyButton: { 
    padding: 15,
    backgroundColor: '#4caf50',
    borderRadius: 10 
  },
  useButton: { 
    padding: 15,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    marginLeft: 15 
  },

  contactInput: { 
    height: 50, 
    borderWidth: 1,
    borderColor: '#d1c6b1',
    borderRadius: 10,
    padding: 12, 
    marginBottom: 15 
  },

  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#8fbc8f',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: 'auto',
  },
  deleteButton: {
    backgroundColor: '#f1a1a1',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: 'auto',
  },
});

export default styles;
