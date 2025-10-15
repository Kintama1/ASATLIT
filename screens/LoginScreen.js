import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image } from 'react-native'
import { useState } from 'react'; 
import { COLORS } from '../constants/colors';
import logo from '../assets/ASATLIT-Logo.png'
import { signIn } from '../services/authService';


export default function LoginScreen({navigation}){
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        const { data, error } = await signIn(email, password);
        
        if (error) {
            alert(error.message);
        } else {
            console.log("Login successful!", data.user);
            navigation.navigate('Home'); // We'll create this screen next
        }
};

    return (
        <View style={styles.container}>

        <Image 
        source={logo}
        style={styles.logo}
        />
        <View style={styles.loginCard}>
        <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder='Enter email'
        placeholderTextColor="rgba(255, 255, 255, 0.6)"  // Semi-transparent white
        style = {styles.input}
        />
     <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder='Enter Password'
        placeholderTextColor="rgba(255, 255, 255, 0.6)"  // Semi-transparent white
        style = {styles.input}
        />
        <TouchableOpacity onPress={()=>navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>forgot password?</Text>
        </TouchableOpacity>
        <View style= {styles.buttons}> 
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
       
        </View>
         <TouchableOpacity onPress={()=> navigation.navigate('Register')}>
         <Text style={styles.register}> New here? register your company</Text>
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
    logo : {
        marginBottom: 100,
        width: 200,
        height: 200,
    },
    loginCard: {
    backgroundColor: COLORS.orange,
    width: '100%',           // Full width instead of 85%
    flex: 1,                 // Takes remaining space
    padding: 30,
    borderTopLeftRadius: 30, // Only round top corners
    borderTopRightRadius: 30,
    // Remove: borderRadius: 15
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    },
    input : {
        backgroundColor: 'transparent',
        color: 'white',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.brown,
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        paddlingLeft: 0,
        marginBottom: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,

    },
    button: {
    backgroundColor: COLORS.brown,
    padding: 15,
    borderRadius: 8,
    borderColor: COLORS.brown,
    flex: 1,                
    marginHorizontal: 5,    
    },
    buttonText : {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',

    },
    forgot : {
     color: 'white',
     textAlign: 'center',
     fontSize: 14,
     marginVertical: 5,
     textDecorationLine: 'underline'
    },
    register : {
     color: 'white',
     textAlign: 'center',
     fontSize: 14,
     marginTop: 20,
     textDecorationLine: 'underline'
    }
})