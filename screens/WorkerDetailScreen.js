import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { COLORS } from '../constants/colors';
import { getUserProfile } from '../services/authService';
import { getWorkerSessionsForBoss, calculateTotals } from '../services/workSessionService';
import WorkSessionCard from '../components/WorkSessionCard';

export default function WorkerDetailScreen({ route, navigation }) {
  const { workerId } = route.params;
  
  const [worker, setWorker] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totals, setTotals] = useState({ totalHours: '0.00', unpaidHours: '0.00', unpaidAmount: '0.00' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    setLoading(true);
    
    // Get worker profile
    const { data: workerData } = await getUserProfile(workerId);
    if (workerData) {
      setWorker(workerData);
    }
    
    // Get worker's sessions
    const { data: sessionsData } = await getWorkerSessionsForBoss(workerId);
    if (sessionsData) {
      setSessions(sessionsData);
      const calculatedTotals = calculateTotals(sessionsData, workerData?.hourly_rate || 0);
      setTotals(calculatedTotals);
    }
    
    setLoading(false);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>⏱️</Text>
      <Text style={styles.emptyTitle}>No Hours Logged</Text>
      <Text style={styles.emptyText}>
        This worker hasn't logged any hours yet.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Teal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.workerName}>
          {worker ? `${worker.first_name} ${worker.last_name}` : 'Worker Details'}
        </Text>
        <Text style={styles.workerEmail}>{worker?.email}</Text>

        {/* Summary Stats */}
        {!loading && sessions.length > 0 && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Hours</Text>
              <Text style={styles.statValue}>{totals.totalHours}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Hourly Rate</Text>
              <Text style={styles.statValue}>${worker?.hourly_rate || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Unpaid</Text>
              <Text style={styles.statValue}>${totals.unpaidAmount}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Orange Card Container */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Work History</Text>
        
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
  backButton: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  workerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  workerEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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