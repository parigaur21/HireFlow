const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await Job.deleteMany();
        await User.deleteMany();

        // Create a recruiter user
        const recruiter = await User.create({
            name: 'John Doe',
            email: 'recruiter@example.com',
            password: 'password123',
            role: 'recruiter',
            location: 'New York'
        });

        // Sample Jobs
        const jobs = [
            {
                title: 'Senior Frontend Developer',
                company: 'Google',
                description: 'We are looking for an experienced React developer to join our team in mountain view. Required skills: React, TypeScript, Redux, CSS.',
                location: 'Mountain View, CA',
                experienceRequired: 5,
                requiredSkills: ['React', 'TypeScript', 'Redux', 'CSS'],
                postedBy: recruiter._id
            },
            {
                title: 'Backend Engineer (Node.js)',
                company: 'Amazon',
                description: 'Build scalable microservices with Node.js and MongoDB. Strong knowledge of REST APIs and AWS required.',
                location: 'Seattle, WA',
                experienceRequired: 3,
                requiredSkills: ['Node.js', 'MongoDB', 'AWS', 'REST'],
                postedBy: recruiter._id
            },
            {
                title: 'Full Stack Ninja',
                company: 'Meta',
                description: 'A versatile engineer who can handle both frontend and backend. MERN stack is preferred. Python knowledge is a plus.',
                location: 'Menlo Park, CA',
                experienceRequired: 4,
                requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python'],
                postedBy: recruiter._id
            },
            {
                title: 'Junior UI/UX Developer',
                company: 'Microsoft',
                description: 'Help us design and implement beautiful user interfaces using React and Tailwind CSS.',
                location: 'Redmond, WA',
                experienceRequired: 1,
                requiredSkills: ['React', 'Tailwind', 'Figma', 'CSS'],
                postedBy: recruiter._id
            },
            {
                title: 'Data Scientist',
                company: 'OpenAI',
                description: 'Working on LLMs and refining training data using Python and PyTorch.',
                location: 'San Francisco, CA',
                experienceRequired: 2,
                requiredSkills: ['Python', 'PyTorch', 'Data Science'],
                postedBy: recruiter._id
            }
        ];

        await Job.insertMany(jobs);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Job.deleteMany();
        await User.deleteMany();
        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});
