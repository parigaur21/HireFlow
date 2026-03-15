const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Job = require('../models/Job');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // Clear existing data
        console.log('Cleaning existing data...');
        await User.deleteMany();
        await Job.deleteMany();

        // Create a Recruiter
        console.log('Creating sample recruiter...');
        const recruiter = await User.create({
            name: 'John Recruiter',
            email: 'recruiter@hireflow.com',
            password: 'password123',
            role: 'recruiter'
        });

        const sampleJobs = [
            {
                title: 'Senior Frontend Developer',
                description: 'We are looking for a React expert to build modern, high-performance web applications using Vite, Redux, and Tailwind CSS. Experience with TypeScript is a plus.',
                company: 'TechFlow Solutions',
                requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Redux'],
                experienceRequired: 5,
                location: 'Remote',
                postedBy: recruiter._id
            },
            {
                title: 'Backend Engineer (Node.js)',
                description: 'Join our backend team to build scalable APIs using Express, MongoDB, and AWS. You will be responsible for designing database schemas and optimizing server performance.',
                company: 'CodeStream Inc.',
                requiredSkills: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'],
                experienceRequired: 3,
                location: 'San Francisco, CA',
                postedBy: recruiter._id
            },
            {
                title: 'Full Stack Ninja',
                description: 'Exciting opportunity for a versatile developer who loves moving between frontend and backend. Working with MERN stack to deliver end-to-end features.',
                company: 'HireWave AI',
                requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js', 'Next.js'],
                experienceRequired: 4,
                location: 'Remote',
                postedBy: recruiter._id
            },
            {
                title: 'DevOps Specialist',
                description: 'Manage our CI/CD pipelines and Kubernetes clusters. Experience with Terraform and monitoring tools like Prometheus is highly valued.',
                company: 'CloudVerse',
                requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'AWS', 'DevOps'],
                experienceRequired: 5,
                location: 'Austin, TX',
                postedBy: recruiter._id
            }
        ];

        console.log('Seeding sample jobs...');
        await Job.insertMany(sampleJobs);

        console.log('✅ Seeding complete!');
        console.log('--- Credentials ---');
        console.log('Email: recruiter@hireflow.com');
        console.log('Password: password123');
        console.log('Role: recruiter');
        console.log('-------------------');

        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedData();
