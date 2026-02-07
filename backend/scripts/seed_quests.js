require('dotenv').config();
const mongoose = require('mongoose');
const Quest = require('../src/models/Quest');

const sampleQuests = [
    {
        id: 'cotton-basics',
        title: 'Cotton Planting Basics',
        description: 'Learn the fundamentals of planting cotton for optimal yield.',
        activities: ['Soil Preparation', 'Seed Selection', 'Sowing'],
        outcomes: ['Understanding soil needs', 'Proper spacing techniques'],
        difficulty: 'Beginner',
        cropType: 'Cotton',
        xpReward: 100,
        badgeName: 'Cotton Sprout',
        steps: [
            {
                title: 'Prepare the Soil',
                objective: 'Till the soil to a depth of 20cm.',
                subSteps: ['Check moisture level', 'Remove weeds'],
                tip: 'Cotton loves well-drained soil.',
                image: 'https://example.com/cotton_soil.jpg'
            },
            {
                title: 'Sowing Seeds',
                objective: 'Plant seeds at appropriate depth.',
                subSteps: ['Dig small holes', 'Place seeds', 'Cover gently'],
                tip: 'Do not plant too deep.',
                image: 'https://example.com/cotton_sow.jpg'
            }
        ],
        active: true
    },
    {
        id: 'wheat-harvest',
        title: 'Wheat Harvesting Guide',
        description: 'Master the art of harvesting wheat at the right time.',
        activities: ['Checking maturity', 'Harvesting', 'Drying'],
        outcomes: ['Maximized grain quality', 'Reduced loss'],
        difficulty: 'Pro',
        cropType: 'Wheat',
        xpReward: 200,
        badgeName: 'Golden Sheaf',
        steps: [
            {
                title: 'Check Maturity',
                objective: 'Ensure grain moisture is below 14%.',
                subSteps: ['Visual inspection', 'Moisture meter test'],
                tip: 'Test multiple spots in the field.',
                image: 'https://example.com/wheat_check.jpg'
            }
        ],
        active: true
    },
    {
        id: 'general-soil',
        title: 'Soil Health Maintenance',
        description: 'Keep your farm soil healthy and productive year-round.',
        activities: ['Composting', 'Cover Cropping'],
        outcomes: ['Better water retention', 'Nutrient rich soil'],
        difficulty: 'Beginner',
        cropType: 'General',
        xpReward: 80,
        badgeName: 'Earth Guardian',
        steps: [
            {
                title: 'Composting',
                objective: 'Create a compost pile.',
                subSteps: ['Collect organic waste', 'Layer browns and greens'],
                tip: 'Turn the pile regularly.',
                image: 'https://example.com/compost.jpg'
            }
        ],
        active: true
    }
];

const seedQuests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        console.log('Clearing existing quests...');
        await Quest.deleteMany({});

        console.log('Seeding quests...');
        await Quest.insertMany(sampleQuests);

        console.log('Quests seeded successfully!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding quests:', error);
    }
};

seedQuests();
