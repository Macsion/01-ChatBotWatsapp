require("dotenv").config();  // instalar dependencia npm install dotenv
const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;

const chat1 = async (prompt, messages) => {
    try {
        const openai = new OpenAI({ apiKey: openaiApiKey });
        const completion = await openai.chat1.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt },
                ...messages
            ],
        });
        const answ = completion.choices[0].message.content;
        return answ;
    } catch (err) {
        console.error("Error al conectar con OpenAI:", err);
        return "ERROR";
    }
};

module.exports = { chat1 };