import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'; 
import { COLORS } from '../constants/colors';
import logo from '../assets/ASATLIT-Logo.png'
import { signUp } from '../services/authService';

export default function RegisterScreen({navigation}){
    const [fullName, setFullName] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName]= useState('')

    const handleSignup = async()=> {
        console.log("WE ARE FIRING THIS UP");
        if (password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }
        if (!password || !email){
            alert("Please fill in all fields")
        }
        const {data, error} = await signUp(email, password);
        console.log("seeing data that came back from Supa", data);
        if (error) {
            alert(error.message);
        }
        else {
            alert("Singup succsessful, check email for confirmation");
            navigation.navigate('Login');
        }
    }
    return (
        <View style={styles.container}>
            <Image 
                source={logo}
                style={styles.logo}
            />
            <View style={styles.registerCard}>
                <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder='Enter full name'
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.input}
                />
                <TextInput
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder='Enter company name'
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.input}
                />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Enter email'
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Enter password'
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.input}
                    secureTextEntry={true}
                />
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder='Confirm password'
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.input}
                    secureTextEntry={true}
                />
                
                <View style={styles.buttons}> 
                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText} >Register</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                <Text style={styles.login}>Already have an account? Login</Text>
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
    registerCard: {
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
    input: {
        backgroundColor: 'transparent',
        color: 'white',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.brown,
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        paddingLeft: 0,
        marginBottom: 20,
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
    login: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
        textDecorationLine: 'underline'
    }
})
