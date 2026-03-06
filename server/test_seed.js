const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const importData = async () => {
    try {
        await Job.deleteMany();
        const john = await User.findOne({ email: 'recruiter@example.com' });
        const jane = await User.findOne({ email: 'jane@hireflow.com' });

        // (adding jobs here)
        const jobs = [
            { title: 'BlockChain Dev', company: 'Web3 co', description: 'test', location: 'remote', experienceRequired: 1, requiredSkills: ['solidity'], postedBy: john._id },
        ];
        await Job.insertMany(jobs);
        fs.writeFileSync('seeding_done.txt', 'Done: ' + new Date().toISOString());
        process.exit();
    } catch (err) {
        fs.writeFileSync('seeding_error.txt', err.message);
        process.exit(1);
    }
};

mongoose.connect(process.env.MONGO_URI).then(importData);
