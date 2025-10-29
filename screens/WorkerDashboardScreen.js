import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { getUserProfile } from '../services/authService';
import { signOut } from '../services/authService';
import { getWorkerSessions, calculateTotals } from '../services/workSessionService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkSessionCard from '../components/WorkSessionCard';

export default function WorkerDashboardScreen({ navigation }) {
  const [workerName, setWorkerName] = useState('');
  const [sessions, setSessions] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [totals, setTotals] = useState({ totalHours: '0.00', unpaidHours: '0.00', unpaidAmount: '0.00' });
  const [loading, setLoading] = useState(true);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadWorkerData();
    }, [])
  );

  const loadWorkerData = async () => {
    setLoading(true);
    
    const userId = await AsyncStorage.getItem('userId');
    
    // Get profile
    const { data: profile } = await getUserProfile(userId);
    if (profile) {
      setWorkerName(profile.first_name);
      setHourlyRate(profile.hourly_rate || 0);
    }
    
    // Get sessions
    const { data: sessionsData } = await getWorkerSessions(userId);
    if (sessionsData) {
      setSessions(sessionsData);
      const calculatedTotals = calculateTotals(sessionsData, profile?.hourly_rate || 0);
      setTotals(calculatedTotals);
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      alert(error.message);
    } else {
      await AsyncStorage.clear();
      navigation.replace('Login');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>⏱️</Text>
      <Text style={styles.emptyTitle}>No Hours Logged Yet</Text>
      <Text style={styles.emptyText}>
        Tap "Log Work Hours" above to record your first shift!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Teal Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {workerName || 'Worker'}!
        </Text>

        {/* Summary Stats */}
        {!loading && sessions.length > 0 && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Hours</Text>
              <Text style={styles.statValue}>{totals.totalHours}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Unpaid</Text>
              <Text style={styles.statValue}>${totals.unpaidAmount}</Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.logHoursButton}
          onPress={() => navigation.navigate('LogHours')}
        >
          <Text style={styles.logHoursButtonText}>⏱️ Log Work Hours</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Orange Card Container */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Your Hours</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="white" style={styles.loader} />
        ) : (
          <FlatList
            data={sessions}
            renderItem={({ item }) => <WorkSessionCard session={item} />}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  logHoursButton: {
    backgroundColor: COLORS.orange,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logHoursButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: COLORS.orange,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});