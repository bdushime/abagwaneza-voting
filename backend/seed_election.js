const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');
const Position = require('./models/Position'); // We will create this next
const Candidate = require('./models/Candidate'); // We will create this next
const connectDB = require('./config/db');

dotenv.config();

const seedElection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 MongoDB Connected...');

        // 1. Clear old election data
        await Position.deleteMany();
        await Candidate.deleteMany();
        console.log('🗑️  Old Election Data Cleared...');

        // 2. Create Positions
        const positions = await Position.insertMany([
            { title: "President", rank: 1 },
            { title: "Vice President", rank: 2 },
            { title: "Treasurer", rank: 3 },
            { title: "Counsellor", rank: 4 }
        ]);

        // 3. Get all members to turn them into candidates
        const members = await Member.find();

        // 4. Assign Candidates (For testing, we pick the first 3 members for EACH position)
        // In real life, you would pick specific people.
        const candidatesPayload = [];

        positions.forEach(pos => {
            // Pick first 3 members as candidates for this position
            const candidatesForThisRole = members.slice(0, 3); 
            
            candidatesForThisRole.forEach(member => {
                candidatesPayload.push({
                    fullName: member.fullName, // Store name here for easy access
                    positionId: pos._id,
                    memberId: member._id,
                    photoUrl: "https://via.placeholder.com/150" // Placeholder image
                });
            });
        });

        await Candidate.insertMany(candidatesPayload);

        console.log('✅ Election Data Created!');
        console.log(`- Created ${positions.length} Positions`);
        console.log(`- Created ${candidatesPayload.length} Candidates`);
        
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedElection();