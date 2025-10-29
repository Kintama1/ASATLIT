import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/colors';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogHoursScreen({ navigation }) {
  const [workDate, setWorkDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [hoursWorked, setHoursWorked] = useState('0.00');
  const [loading, setLoading] = useState(false);

  // Show/hide pickers (Android needs this)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Calculate hours whenever start or end time changes
  useEffect(() => {
    calculateHours();
  }, [startTime, endTime]);

  const calculateHours = () => {
    const diff = endTime - startTime; // Difference in milliseconds
    const hours = diff / (1000 * 60 * 60); // Convert to hours
    
    if (hours > 0 && hours <= 24) {
      setHoursWorked(hours.toFixed(2));
    } else {
      setHoursWorked('0.00');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    if (endTime <= startTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    if (parseFloat(hoursWorked) <= 0) {
      Alert.alert('Error', 'Invalid hours calculated');
      return;
    }

    if (workDate > new Date()) {
      Alert.alert('Error', 'Cannot log future hours');
      return;
    }

    setLoading(true);

    try {
      const userId = await AsyncStorage.getItem('userId');

      // Format date as YYYY-MM-DD
      const formattedDate = workDate.toISOString().split('T')[0];
      
      // Format times as HH:MM:SS
      const formattedStartTime = startTime.toTimeString().split(' ')[0];
      const formattedEndTime = endTime.toTimeString().split(' ')[0];

      const { error } = await supabase
        .from('work_sessions')
        .insert({
          user_id: userId,
          work_date: formattedDate,
          location: location.trim(),
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          hours_worked: parseFloat(hoursWorked),
          status: 'pending'
        });

      if (error) throw error;

      Alert.alert(
        'Success!',
        `Logged ${hoursWorked} hours`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Orange Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Log Work Hours</Text>
        </View>

        {/* Teal Card */}
        <View style={styles.formCard}>
          {/* Work Date */}
          <Text style={styles.label}>Work Date</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              📅 {formatDate(workDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={workDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setWorkDate(date);
              }}
              maximumDate={new Date()} // Can't pick future dates
            />
          )}

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Downtown Clinic"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={location}
            onChangeText={setLocation}
          />

          {/* Start Time */}
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              🕐 {formatTime(startTime)}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, time) => {
                setShowStartPicker(Platform.OS === 'ios');
                if (time) setStartTime(time);
              }}
            />
          )}

          {/* End Time */}
          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              🕐 {formatTime(endTime)}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, time) => {
                setShowEndPicker(Platform.OS === 'ios');
                if (time) setEndTime(time);
              }}
            />
          )}

          {/* Calculated Hours Display */}
          <View style={styles.hoursDisplay}>
            <Text style={styles.hoursLabel}>Total Hours:</Text>
            <Text style={styles.hoursValue}>{hoursWorked} hrs</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit Entry'}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.orange,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  formCard: {
    backgroundColor: COLORS.primary,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'rgba(0, 128, 128, 0.3)',
    color: 'white',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.orange,
    padding: 15,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerButton: {
    backgroundColor: 'rgba(0, 128, 128, 0.3)',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.orange,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  hoursDisplay: {
    backgroundColor: 'rgba(255, 152, 67, 0.3)',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  hoursLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  hoursValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.orange,
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
});