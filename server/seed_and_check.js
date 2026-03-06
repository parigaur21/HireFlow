const { execSync } = require('child_process');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const runSeeder = async () => {
    console.log('--- Seeding Start ---');
    try {
        const out = execSync('node seeder.js', { cwd: __dirname }).toString();
        console.log('Seeder Output:', out);
    } catch (err) {
        console.error('Seeder Error:', err.stderr?.toString() || err.message);
    }
    console.log('--- Seeding End ---');

    console.log('--- DB Check ---');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Job.countDocuments();
        console.log(`Job count in DB: ${count}`);
        const jobs = await Job.find().limit(20);
        jobs.forEach(j => console.log(`- ${j.title}`));
        process.exit();
    } catch (err) {
        console.error('DB Error:', err.message);
        process.exit(1);
    }
};

runSeeder();
