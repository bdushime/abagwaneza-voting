const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member'); // Ensure this path is correct based on your folder structure
const connectDB = require('./config/db');

// Load environment variables (to get MONGO_URI)
dotenv.config();

// THE DATA: Replace these phone numbers with REAL ones!
// format: 2507... (No + sign)
const membersList = [
    { fullName: "NYIRABUDIGIRI Immaculée", phone: "250780000001" },
    { fullName: "MUKASHYAKA Drocelle", phone: "250780000002" },
    { fullName: "MUKAMISHA Peace", phone: "250780000003" },
    { fullName: "MUKANYANGEZI Mélène", phone: "250780000004" },
    { fullName: "MUKANKUBITO Immaculée", phone: "250780000005" },
    { fullName: "NZAMUYE Immaculée", phone: "250780000006" },
    { fullName: "KAMURAMBA Philomène", phone: "250780000007" },
    { fullName: "MUKARUTAMU Frieda", phone: "250780000008" },
    { fullName: "MUKAYIRANGA Rosine", phone: "250780000009" },
    { fullName: "MUKARUKUNDO Esperance", phone: "250780000010" },
    // Add YOURSELF (the Admin/11th voter) below for testing
    { fullName: "Dushime Beni Egide", phone: "250784876606" } 
];

const importData = async () => {
    try {
        // 1. Connect to Database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 MongoDB Connected...');

        // 2. Clear existing members (Warning: This deletes old data!)
        await Member.deleteMany();
        console.log('🗑️  Old Member Data Cleared...');

        // 3. Generate PINs and Prepare Data
        console.log('🎲 Generating PINs...');
        
        const membersWithPins = membersList.map(member => {
            // Generate a random 5-digit PIN (e.g., 48291)
            const pin = Math.floor(10000 + Math.random() * 90000).toString();
            return { 
                fullName: member.fullName, 
                phone: member.phone,
                pin: pin,
                hasVoted: false,
                role: 'member' // Default role
            };
        });

        // 4. Insert into Database
        await Member.insertMany(membersWithPins);

        console.log('\n✅ SUCCESS! All members imported.\n');
        console.log('Here are the generated credentials (save this list!):');
        console.log('---------------------------------------------------');
        
        membersWithPins.forEach(m => {
            console.log(`👤 Name: ${m.fullName.padEnd(25)} | 📱 Phone: ${m.phone} | 🔑 PIN: ${m.pin}`);
        });
        
        console.log('---------------------------------------------------');
        console.log(' script finished.');
        
        process.exit();
    } catch (error) {
        console.error(` Error: ${error.message}`);
        process.exit(1);
    }
};

// Run the function
importData();