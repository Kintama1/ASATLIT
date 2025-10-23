import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Image,
} from 'react-native';
import { useState } from 'react'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from '../constants/colors';
import logo from '../assets/ASATLIT-Logo.png';
import { signUp } from '../services/authService';
import FormContainer from '../components/FormContainer';

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName] = useState(''); 
    const [lastName, setLastName] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState('');

    const handleSignup = async() => {
        
        console.log("WE ARE FIRING THIS UP");
        console.log("Loaded URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (!password || !email || !firstName || !lastName || !companyName) {
            alert("Please fill in all fields");
            return;
        }
        console.log("About to send for a sign up");
        const { data, error } = await signUp(email, password, firstName, lastName, companyName);
        console.log("seeing data that came back from Supa", data);
        
        if (error) {
            alert(error.message);
        } else {
            alert("Signup successful, check email for confirmation");
            navigation.navigate('Login');
        }
    }

    return (
        <FormContainer style={styles.container}>
            <KeyboardAwareScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={50}  // Increase from 20 to 50
                extraHeight={100}  // Add this!
                keyboardShouldPersistTaps="handled"
                keyboardOpeningTime={0}  // Add this for instant response
            >
                <View style={styles.topSection}>
                    <Image 
                        source={logo}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.registerCard}>
                    <View style={styles.nameArea}>
                        <TextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder='Enter first name'
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            style={styles.nameInput}
                            autoComplete='off'
                            textContentType="none"
                        />
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder='Enter Last name'
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            style={styles.nameInput}
                            autoComplete='off'
                            textContentType="none"
                        />
                    </View>
                    <TextInput
                        value={companyName}
                        onChangeText={setCompanyName}
                        placeholder='Enter company name'
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        style={styles.input}
                        autoComplete='off'
                        textContentType="none"
                    />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Enter email'
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete='email'
                        textContentType="emailAddress"
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder='Enter password'
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        style={[styles.input, styles.passwordInput]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType="oneTimeCode"
                        autoComplete="off"
                    />
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder='Confirm password'
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        style={[styles.input, styles.passwordInput]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType="oneTimeCode"
                        autoComplete="off"
                    />
                    
                    <View style={styles.buttons}> 
                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.login}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </FormContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 50,  
    },
    topSection: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
    },
    logo: {
        width: 200,
        height: 200,
    },
    registerCard: {
        backgroundColor: COLORS.orange,
        minHeight: '100%',  
        width: '100%',
        padding: 30,
        paddingBottom: 100,  
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nameArea: {
        flexDirection: 'row',
        gap: 10, 
        width: '100%', 
    },
    nameInput: {
        backgroundColor: 'rgba(255, 152, 67, 0.3)',
        color: 'white',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.brown,
        padding: 15,
        paddingLeft: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        flex: 1,
    },
    input: {
        backgroundColor: 'rgba(255, 152, 67, 0.3)',
        color: 'white',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.brown,
        padding: 15,
        paddingLeft: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
    },
    passwordInput: {
        backgroundColor: 'rgba(139, 69, 19, 0.2)',
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
});