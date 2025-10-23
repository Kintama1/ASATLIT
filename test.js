console.log("Testing direct signup POST...");

fetch('http://192.168.20.236:54321/auth/v1/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    },
    body: JSON.stringify({
        email: 'directtest@example.com',
        password: 'test123456'
    })
})
.then(async r => {
    console.log('✅ Direct signup reached! Status:', r.status);
    const text = await r.text();
    console.log('Response body:', text);
})
.catch(e => console.log('❌ Direct signup failed:', e.message));