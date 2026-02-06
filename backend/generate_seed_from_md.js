const fs = require('fs');
const path = require('path');

const questDir = path.join(__dirname, '../frontend/public/images/quests');
const outputStart = `const mongoose = require('mongoose');
require('dotenv').config();
const Quest = require('./models/Quest');

const quests = `;

const outputEnd = `;

const seedQuests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Quest.deleteMany({});
        await Quest.insertMany(quests);
        console.log('Seeded ' + quests.length + ' quests');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedQuests();
`;

const getCategory = (id) => {
    if (id.includes('cotton') || id.includes('boll')) return 'Cotton';
    if (id.includes('coconut')) return 'Coconut';
    if (id.includes('wheat')) return 'Wheat';
    if (id.includes('potato')) return 'Potato';
    if (id.includes('tomato')) return 'Tomato';
    return 'General';
};

const getDifficulty = (id) => {
    if (id.includes('basics') || id.includes('start') || id.includes('mini')) return 'Beginner';
    if (id.includes('pro') || id.includes('master')) return 'Pro';
    return 'Beginner';
};

const generate = () => {
    try {
        if (!fs.existsSync(questDir)) {
            console.error('Quest directory not found:', questDir);
            return;
        }

        const dirs = fs.readdirSync(questDir).filter(f => fs.statSync(path.join(questDir, f)).isDirectory());
        console.log(`Found ${dirs.length} quest directories`);

        const questObjects = [];

        dirs.forEach(dir => {
            const readmePath = path.join(questDir, dir, 'README.md');
            if (!fs.existsSync(readmePath)) {
                // Try lowercase
                const readmePathLower = path.join(questDir, dir, 'readme.md');
                if (!fs.existsSync(readmePathLower)) {
                    console.log(`No README found for ${dir}`);
                    return;
                }
            }

            const content = fs.readFileSync(fs.existsSync(readmePath) ? readmePath : path.join(questDir, dir, 'readme.md'), 'utf-8');
            const lines = content.split('\n');

            const quest = {
                id: dir,
                title: dir.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // default title
                description: '',
                difficulty: getDifficulty(dir),
                cropType: getCategory(dir),
                xpReward: 100,
                steps: [],
                active: true,
                activities: [],
                outcomes: []
            };

            let currentStep = null;
            let readingDescription = false;

            lines.forEach(line => {
                const trimmed = line.trim();

                if (trimmed.startsWith('# ')) {
                    // Extract title
                    quest.title = trimmed.substring(2).replace(' Images', '').replace(' Quest', '').trim();
                } else if (trimmed.startsWith('## Required Images')) {
                    readingDescription = false;
                } else if (trimmed.startsWith('## ')) {
                    // Other sections
                } else if (trimmed.startsWith('### ')) {
                    // ### step1.jpg - Step Title
                    // Format: ### step1.jpg - Material Collection & Pit Preparation
                    const parts = trimmed.substring(4).split(' - ');
                    if (parts.length >= 2) {
                        const imgName = parts[0].trim();
                        const title = parts.slice(1).join(' - ').trim();

                        currentStep = {
                            title: title,
                            image: `/images/quests/${dir}/${imgName}`,
                            subSteps: [],
                            objective: title, // default objective to title
                            tip: ''
                        };
                        quest.steps.push(currentStep);
                    }
                } else if (trimmed.startsWith('- ') && currentStep) {
                    currentStep.subSteps.push(trimmed.substring(2).trim());
                } else if (trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('---') && quest.description.length < 200) {
                    // Simple description extraction heuristic: take text from top of file
                    if (quest.steps.length === 0) {
                        if (!quest.description) quest.description = trimmed;
                        else quest.description += ' ' + trimmed;
                    }
                }
            });

            // Post-process steps
            quest.steps.forEach(step => {
                if (step.subSteps.length > 0) {
                    step.objective = step.subSteps[0];
                }
            });

            // Set main quest image from first step
            if (quest.steps.length > 0) {
                quest.image = quest.steps[0].image;
            }

            // Infer outcomes/activities
            quest.activities = quest.steps.slice(0, 3).map(s => s.title);
            quest.outcomes = [' improved yield', 'sustainable farming', 'soil conservation'];

            questObjects.push(quest);
        });

        console.log(`Generated ${questObjects.length} quest objects`);
        const fileContent = outputStart + JSON.stringify(questObjects, null, 2) + outputEnd;
        fs.writeFileSync(path.join(__dirname, 'seed_from_md.js'), fileContent);
        console.log('Written to seed_from_md.js');

    } catch (error) {
        console.error('Error generating seed:', error);
    }
};

generate();
