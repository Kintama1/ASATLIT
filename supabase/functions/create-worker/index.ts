import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


serve(async (req) => {
  try {
    const {email, firstName, lastName, hourlyRate, bossId} = await req.json()
    console.log("ABOUT TO GET KEYS AND STUFF");
    const supabaseAdmin = createClient(
      Deno.env.get('URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )
    console.log("HAVE WE MADE IT HERE")
    const tempPassword = generatePassword();
    console.log(tempPassword);
    const {data : authData, error: authError} = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true,
    })
    console.log(authData);
    console.log(authError);
    if (authError) throw authError
    console.log("DO WE SEE SOMETHING HERE")

    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        role: 'worker',  // Change from default 'boss' to 'worker'
        company_id: bossId,
        must_change_password: true,
        hourly_rate: hourlyRate
      })
      .eq('id', authData.user.id)
      console.log(profileError)
      if (profileError) throw profileError
      
      //TODO
      //IMPLEMENT EMAIL SERVICE
      return new Response(
        JSON.stringify({
          success: true,
          message: "Worker created successfully",
          tempPassword: tempPassword,
        }),
        {headers: {"Content-Type": "application/json"}}
      )
  } catch(error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {status: 400, headers : {"Content-Type": "application/json"}}
      )
  }
})
function generatePassword(){
  const length = 12
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"
  let password = ""
  for (let i = 0; i < length; i++) {
    password +=charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password;

}