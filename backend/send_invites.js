const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');


dotenv.config();

// 1. Setup the WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(), // Saves your login so you don't scan every time
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// 2. Generate QR Code for you to scan
client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP LINKED DEVICES:');
    qrcode.generate(qr, { small: true });
});

// 3. When connected, start sending
client.on('ready', async () => {
    console.log('✅ WhatsApp Client is Ready!');
    await sendMessages();
});

const sendMessages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database Connected.');

        // Fetch all members
        const members = await Member.find({});

        console.log(`Found ${members.length} members. Starting dispatch...`);

        for (const member of members) {
            // Format phone number: remove '+' if present, add '@c.us' (WhatsApp format)
            const chatId = `${member.phone}@c.us`; 
            
            const message = `Muraho ${member.fullName}! 👋\n\n` +
                            `Amatora ya ABAGWANEZA yaratangiye.\n\n` +
                            `1. Kanda hano: https://your-voting-website.com\n` + // <--- PUT YOUR REAL LINK HERE LATER
                            `2. Hitamo izina ryawe.\n` +
                            `3. Injiza iyi Code yibanga: *${member.pin}*\n\n` +
                            `Ntugasangize iyi code undi muntu.`;

            console.log(`Sending to ${member.fullName}...`);
            
            // Send the message
            await client.sendMessage(chatId, message);
            
            // Wait 5 seconds between messages so WhatsApp doesn't block you
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log('✅ All messages sent!');
        process.exit();

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Start the client
client.initialize();