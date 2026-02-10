
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';
const CHATBOT_URL = 'http://localhost:8000';

async function testChatbot() {
    try {
        console.log('1. Testing Chatbot Service Directly...');
        try {
            const botDirect = await axios.post(`${CHATBOT_URL}/ask`, {
                message: "Hello direct",
                session_id: "test"
            });
            console.log('Chatbot Service Direct Response:', botDirect.data);
        } catch (e) {
            console.error('Chatbot Service connection failed:', e.message);
            if (e.response) console.error('Data:', e.response.data);
        }

        console.log('\n2. Creating Test User...');
        const uniqueId = Date.now();
        const userData = {
            name: "Test Farmer",
            email: `farmer${uniqueId}@test.com`,
            phone: `999${String(uniqueId).slice(-7)}`,
            password: "password123",
            location: "Test Village",
            city: "Test City",
            state: "Test State",
            district: "Test District",
            panchayat: "Test Panchayat"
        };

        let token;
        try {
            const signupRes = await axios.post(`${BASE_URL}/auth/signup`, userData);
            token = signupRes.data.token;
            console.log('User created. Token obtained.');
        } catch (e) {
            console.error('Signup failed:', e.response ? e.response.data : e.message);
            return;
        }

        console.log('\n3. Testing Backend Chatbot Endpoint...');
        try {
            const chatRes = await axios.post(
                `${BASE_URL}/chatbot/message`,
                { message: "Help me grow tomatoes" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Backend Chatbot Response:', chatRes.data);
        } catch (e) {
            console.error('Backend Chatbot Request Failed:', e.message);
            if (e.response) {
                console.error('Status:', e.response.status);
                console.error('Data:', e.response.data);
            }
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

testChatbot();
