import { supabase } from '../lib/supabase';

// Get worker's own sessions
export async function getWorkerSessions(userId) {
  try {
    const { data, error } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('work_date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching worker sessions:', error);
    return { data: null, error };
  }
}

// Get all sessions for a specific worker (boss viewing)
export async function getWorkerSessionsForBoss(workerId) {
  try {
    const { data, error } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('user_id', workerId)
      .order('work_date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { data: null, error };
  }
}

// Calculate total hours and pay
export function calculateTotals(sessions, hourlyRate = 0) {
  const totalHours = sessions.reduce((sum, session) => {
    return sum + parseFloat(session.hours_worked || 0);
  }, 0);

  const unpaidSessions = sessions.filter(s => s.status === 'pending');
  const unpaidHours = unpaidSessions.reduce((sum, session) => {
    return sum + parseFloat(session.hours_worked || 0);
  }, 0);

  const unpaidAmount = unpaidHours * hourlyRate;

  return {
    totalHours: totalHours.toFixed(2),
    unpaidHours: unpaidHours.toFixed(2),
    unpaidAmount: unpaidAmount.toFixed(2),
  };
}