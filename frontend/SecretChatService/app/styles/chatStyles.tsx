import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f1',
    },
    header: {
        fontSize: 24,
        color: '#5e4b3c',
        textAlign: 'center',
        marginTop: 20,
    },
    messageContainer: {
        flex: 1,
        padding: 10,
    },
    messageList: {
        paddingBottom: 20,
    },
    messageBubble: {
        backgroundColor: '#e5ded1',
        borderRadius: 15,
        padding: 10,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    messageText: {
        fontSize: 16,
        color: '#5e4b3c',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#e5ded1',
        borderTopWidth: 1,
        borderTopColor: '#d1c6b1',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#d1c6b1',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f1',
        color: '#5e4b3c',
    },
    backButton: {
        fontSize: 16,
        color: '#c2a55c',
    },
});

export default styles;
