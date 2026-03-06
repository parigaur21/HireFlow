const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Job.countDocuments();
        console.log(`count:${count}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
