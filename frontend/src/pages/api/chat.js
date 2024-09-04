import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=AIzaSyCPlAQSY7oF0dzca_vBcr4ifQGAlWqg-a8";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        try {
            const response = await axios.post(GEMINI_API_URL, {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: message
                            }
                        ]
                    }
                ]
            });

            // Log the API response for debugging
            console.log('API response:', response.data);

            // Extract the bot's reply from the response
            const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (botReply) {
                res.status(200).json({ reply: botReply });
            } else {
                res.status(500).json({ error: 'Unexpected response format from Gemini API' });
            }
        } catch (error) {
            console.error('Error communicating with Gemini API:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                res.status(500).json({ error: 'Failed to communicate with Gemini API', details: error.response.data });
            } else if (error.request) {
                console.error('Request data:', error.request);
                res.status(500).json({ error: 'No response from Gemini API' });
            } else {
                console.error('Error message:', error.message);
                res.status(500).json({ error: 'Error in making the request to Gemini API', details: error.message });
            }
        }
    } else {
        res.status(405).json({ error: 'Only POST method is allowed' });
    }
}
