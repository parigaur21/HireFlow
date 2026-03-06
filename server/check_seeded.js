const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Job.countDocuments();
        console.log(`Total jobs in DB: ${count}`);
        const jobs = await Job.find().limit(5).select('title company');
        console.log('Sample jobs:');
        jobs.forEach(j => console.log(`- ${j.title} @ ${j.company}`));
        process.exit();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

checkJobs();
