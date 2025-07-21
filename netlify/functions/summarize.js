const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API key is not set in Netlify environment.");
        }
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const body = JSON.parse(event.body);
        const prompt = body.contents[0].parts[0].text;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // --- THIS IS THE FIX ---
        // Instead of sending the whole complex object, we send only the text.
        const text = response.text();
        return {
            statusCode: 200,
            body: text 
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};