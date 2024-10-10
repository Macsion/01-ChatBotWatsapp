const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chat2 = async (prompt, text) => {
    try {
        // Choose a model that's appropriate for your use case.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const formatPrompt = prompt + `\n\nEl input del usuario es el siguiente: ` + text;

        const result = await model.generateContent(formatPrompt);
        const response = result.response;
        const answ = response.text();
        return answ
    }
    catch {
        console.error("Error al conectar con Gemini:", err);
        return "Ha ocurrido un ERROR. Escribe 'Menu' para volver al inicio";
    }
}
module.exports = { chat2 };