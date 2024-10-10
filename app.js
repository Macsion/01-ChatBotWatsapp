const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { isActive, isConvActive } = require("./scripts/utils.js")
const { welcomeFlow } = require('./flows/welcome.flow.js');
const { gptFlow } = require('./flows/gpt.flow.js');
const { geminiFlow } = require("./flows/gemini.flow.js");
const { voiceNoteFlow } = require('./flows/voiceNote.flow.js');
const { adminFlow } = require('./flows/admin.flow.js');
const { sendPdfFlow } = require('./flows/sendPdf.flow.js');
const { menuFlow } = require('./flows/menu.flow.js');
const { formFlow } = require('./flows/form.flow.js');

const express = require('express');   // se utiliza para dejar publica la carpeta pdfs
const path = require('path');
const app = express();

// Ruta correcta para servir archivos estáticos desde la carpeta 'pdfs'
const pdfFolderPath = path.join(__dirname, 'pdfs');
app.use('/pdfs', express.static(pdfFolderPath));

const port = 4000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

const flowPrincipal = addKeyword(EVENTS.WELCOME) //Este es el flujo por donde pasan TODOS los mensajes escritos
    .addAction(async (ctx, ctxFn) => {
        //Primero, el bot esta Activo Globalmente?
        if (!await isActive(ctx, ctxFn)) {
            return ctxFn.endFlow() // No, esta desactivado. Fin del flujo
        } //Si, esta activo. Siguiente pregunta

        //Segundo, la conversación esta activa?
        if (!await isConvActive(ctx.from, ctxFn)) {
            return ctxFn.endFlow() // No, la conversación esta desactivada. Fin de l flujo
        } //Si, el bot tiene que contestar. Siguiente pregunta

        //Tercero, el usuario esta saludando?
        const keywords = ["hola", "buenas", "ola", "que tal", "olis", "buen dia", "buenas tardes"];
        const bodyText = ctx.body.toLowerCase();  // Se utiliza para que no sea sensible a mayusculas y minusculas
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
        if (containsKeyword && ctx.body.length < 8) {
            return await ctxFn.gotoFlow(welcomeFlow) //Si, esta saludando. Direcciona la flow de welcome
        } //No, no esta saludando o junto con el saludo hizo una pregunta. Siguiente pregunta

        //Cuarto, el usuario quiere abrir el menu?
        if (ctx.body.length > 8 || (!ctx.body.toLowerCase().includes("menu") && ctx.body.length < 8)) {
            return ctxFn.gotoFlow(geminiFlow) //No, pregunto algo directamente. Direcciona al flow gemini
        } else {
            return ctxFn.gotoFlow(menuFlow) //Si, quiere abrir el menu. Direcciona al flow menu
        }
    })



const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, voiceNoteFlow, menuFlow, formFlow, welcomeFlow, gptFlow, adminFlow, sendPdfFlow, geminiFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

