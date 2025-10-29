import { supabase } from '../lib/supabase';

export const signUp = async (email, password, firstName, lastName, companyName) => {
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
    });
    
    console.log("Signup data:", data);
    console.log("Signup error:", error);
    
    if (error) {  
        console.log("Auth error:", error);
        return {data: null, error};  
    }
    
    console.log("Auth succeeded, updating profile...");
    
    const {error: profileError} = await supabase
        .from('user_profiles')
        .upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            role: 'boss',
        })
    
    if (profileError) {
        console.log("Profile update error:", profileError);
        return {data, error: profileError};  // ✅ Fixed
    }
    
    console.log("Success! Returning data:", data);
    return {data, error: null};  // ✅ Fixed
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Error fetching profile:', error);
        return { data: null, error };
    }
    
    return { data, error: null };
}