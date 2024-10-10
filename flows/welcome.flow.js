const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const welcomeFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        await ctxFn.endFlow("*Bienvenido a este chatbot 🤖!* Podes escribir *'Menu'* para ver las opciones o directamente hacer una consulta")
    })

module.exports = { welcomeFlow };