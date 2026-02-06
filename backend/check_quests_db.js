require('dotenv').config();
const mongoose = require('mongoose');
const Quest = require('./models/Quest');

const checkQuests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const count = await Quest.countDocuments();
        console.log(`Total quests: ${count}`);

        if (count > 0) {
            const quests = await Quest.find({}).limit(1);
            console.log('Sample quest:', JSON.stringify(quests[0], null, 2));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkQuests();
