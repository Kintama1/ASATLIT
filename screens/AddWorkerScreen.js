import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import logo from '../assets/ASATLIT-Logo.png';

export default function AddWorkerScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddWorker = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const bossId = await AsyncStorage.getItem('userId');

      const { data, error } = await supabase.functions.invoke('create-worker', {
        body: {
          email,
          firstName,
          lastName,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
          bossId
        }
      });

      if (error) throw error;

      Alert.alert(
        'Success!', 
        `Worker created!\n\nTemp Password: ${data.tempPassword}\n\nSend this to ${firstName}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={50}
        extraHeight={100}
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
      >
        {/* Orange Top Section with Inputs */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Add New Worker</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={lastName}
            onChangeText={setLastName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Hourly Rate (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAddWorker}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Worker...' : 'Add Worker'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Teal Bottom Section with Logo */}
        <View style={styles.bottomSection}>
          <Image source={logo} style={styles.logo} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: COLORS.orange,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  bottomSection: {
    backgroundColor: COLORS.primary, // Teal background continues
    flex: 1,
    width: '100%',
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 152, 67, 0.3)', // Semi-transparent orange
    color: 'white',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brown,
    padding: 15,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.brown,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
