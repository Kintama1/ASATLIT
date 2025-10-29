import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { Image } from 'react-native';
import logo from '../assets/ASATLIT-Logo.png';
import { getBossProfile, getBossWorkers } from '../services/workerService';
import { signOut } from '../services/authService';
import WorkerCard from '../components/WorkerCard';

export default function BossDashboardScreen({ navigation }) {
  const [bossName, setBossName] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Load boss info
    const { data: bossData } = await getBossProfile();
    if (bossData) {
      setBossName(bossData.first_name);
    }
    
    // Load workers
    const { data: workersData } = await getBossWorkers();
    if (workersData) {
      setWorkers(workersData);
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      alert(error.message);
    } else {
      navigation.navigate('Login');
    }
  };

const handleWorkerPress = (worker) => {
  navigation.navigate('WorkerDetail', { workerId: worker.id });
};

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image 
        source={logo}
        style={styles.emptyLogo}
      />
      <Text style={styles.emptyTitle}>No Workers Yet</Text>
      <Text style={styles.emptyText}>
        Tap "Add New Worker" above to get started!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Teal Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {bossName || 'Boss'}!
        </Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddWorker')}
        >
          <Text style={styles.addButtonText}>+ Add New Worker</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Orange Card Container */}
      <View style={styles.workersCard}>
        <Text style={styles.sectionTitle}>Your Team</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brown} style={styles.loader} />
        ) : (
          <FlatList
            data={workers}
            renderItem={({ item }) => (
              <WorkerCard 
                worker={item} 
                onPress={() => handleWorkerPress(item)}
              />
            )}
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
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.brown,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  workersCard: {
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
  emptyLogo: {
  width: 120,
  height: 120,
  marginBottom: 20,
},
});