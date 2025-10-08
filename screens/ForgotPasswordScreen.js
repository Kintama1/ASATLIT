import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'; 
import { COLORS } from '../constants/colors';
import logo from '../assets/ASATLIT-Logo.png'

export default function ForgotPasswordScreen({navigation}){
    const [email, setEmail] = useState(''); 

    return (
        <View style={styles.container}>
            <Image 
                source={logo}
                style={styles.logo}
            />
            <View style={styles.forgotCard}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we'll send you a link to reset your password.
                </Text>
                
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Enter your email'
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <View style={styles.buttons}> 
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLogin}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "flex-start",  
        paddingTop: 60,               
    },
    logo: {
        marginBottom: 80,
        width: 200,
        height: 200,
    },
    forgotCard: {
        backgroundColor: COLORS.orange,
        width: '100%',
        flex: 1,
        padding: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    input: {
        backgroundColor: 'transparent',
        color: 'white',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.brown,
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        paddingLeft: 0,
        marginBottom: 30,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: COLORS.brown,
        padding: 15,
        borderRadius: 8,
        borderColor: COLORS.brown,
        flex: 1,                
        marginHorizontal: 5,    
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backToLogin: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 30,
        textDecorationLine: 'underline'
    }
})
