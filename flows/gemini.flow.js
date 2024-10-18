require("dotenv").config();
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { chat2 } = require("../scripts/gemini");
const path = require('path');
const fs = require('fs');
const pdf = require("pdf-parse");

/*// Me conecto con drive para tener las credenciales y permisos de acceso
const driveCredentials = JSON.parse(process.env.Drivechatbot);

if (!driveCredentials) {
    throw new Error('Drivechatbot environment variable is not defined');
}
// Ruta al archivo Drivechatbot.json
const driveJsonPath = path.join(process.cwd(), 'Drivechatbot.json');

// Verifica si el archivo Drivechatbot.json existe, si no, lo crea
if (!fs.existsSync(driveJsonPath)) {
    try {
        fs.writeFileSync(driveJsonPath, JSON.stringify(driveCredentials, null, 2));
        console.log('Drivechatbot.json file created successfully.');
    } catch (error) {
        throw new Error(`Failed to write Drivechatbot.json file: ${error.message}`);
    }
} else {
    console.log('Drivechatbot.json file already exists.');
}

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './Drivechatbot.json' });*/


const geminiFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        /*  // Me conecto con el archivo a utilizar que esta en drive
          const bucketName = 'drive0_bucket-1'; // Reemplaza con el nombre de tu bucket
          const fileName = 'ModulosPrecios.pdf'; // Reemplaza con el nombre del archivo en el bucket
          const destination = './temp.pdf'; // Archivo temporal donde se descargará el PDF
          const bucket = storage.bucket(bucketName);
          const file = bucket.file(fileName);
          await file.download({ destination });*/
        // modifico el texto del pdf a texto plano para enviar a Gemini 
        const pdfpath = "./pdfs/modulos precios en pesos.pdf";
        const pdfBuff = fs.readFileSync(pdfpath)
        const pdfRead = await pdf(pdfBuff)
        const pdfText = pdfRead.text


        const prompt = "Sos un experto vendedor de un servicio de reparacion de celulares al que van a hacer preguntas sobre los precios de las reparaciones. No des saludos pero si ten un buen dialogo, solo responde la consulta de forma amigable y completa. Al responder con informacion utiliza formato Buletpoint y emojis, en un formato entendible. Pedi que vuelvan a escribir la palabra 'menu' si no tienen otra consulta. La lista de precios es la siguiente:" + pdfText
        const text = ctx.body
        const response = await chat2(prompt, text)

        await ctxFn.flowDynamic(response);
    }
    );

module.exports = { geminiFlow };

