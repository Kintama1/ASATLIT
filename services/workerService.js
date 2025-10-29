import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get boss's profile info
export async function getBossProfile() {
  try {
    const userId = await AsyncStorage.getItem('userId');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, company_name')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching boss profile:', error);
    return { data: null, error };
  }
}

// Get all workers for this boss
export async function getBossWorkers() {
  try {
    const bossId = await AsyncStorage.getItem('userId');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, email, hourly_rate')
      .eq('company_id', bossId)
      .eq('role', 'worker')
      .order('created_at', { ascending: false }); // Newest first
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching workers:', error);
    return { data: null, error };
  }
}

