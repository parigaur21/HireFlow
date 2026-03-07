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

        // Create recruiter users with its details!
        const john = await User.create({
            name: 'John Doe',
            email: 'recruiter@example.com',
            password: 'password123',
            role: 'recruiter',
            location: 'New York'
        });

        const jane = await User.create({
            name: 'Jane Smith',
            email: 'jane@hireflow.com',
            password: 'password123',
            role: 'recruiter',
            location: 'San Francisco'
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
                postedBy: john._id
            },
            {
                title: 'Backend Engineer (Node.js)',
                company: 'Amazon',
                description: 'Build scalable microservices with Node.js and MongoDB. Strong knowledge of REST APIs and AWS required.',
                location: 'Seattle, WA',
                experienceRequired: 3,
                requiredSkills: ['Node.js', 'MongoDB', 'AWS', 'REST'],
                postedBy: john._id
            },
            {
                title: 'Full Stack Ninja',
                company: 'Meta',
                description: 'A versatile engineer who can handle both frontend and backend. MERN stack is preferred. Python knowledge is a plus.',
                location: 'Menlo Park, CA',
                experienceRequired: 4,
                requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python'],
                postedBy: john._id
            },
            {
                title: 'Junior UI/UX Developer',
                company: 'Microsoft',
                description: 'Help us design and implement beautiful user interfaces using React and Tailwind CSS.',
                location: 'Redmond, WA',
                experienceRequired: 1,
                requiredSkills: ['React', 'Tailwind', 'Figma', 'CSS'],
                postedBy: john._id
            },
            {
                title: 'Data Scientist',
                company: 'OpenAI',
                description: 'Working on LLMs and refining training data using Python and PyTorch.',
                location: 'San Francisco, CA',
                experienceRequired: 2,
                requiredSkills: ['Python', 'PyTorch', 'Data Science'],
                postedBy: john._id
            },
            {
                title: 'DevOps Engineer',
                company: 'Netflix',
                description: 'Scaling cloud infrastructure and implementing CI/CD pipelines using Kubernetes and Terraform.',
                location: 'Los Gatos, CA',
                experienceRequired: 4,
                requiredSkills: ['Kubernetes', 'Terraform', 'Docker', 'AWS'],
                postedBy: jane._id
            },
            {
                title: 'Product Manager',
                company: 'Stripe',
                description: 'Leading product vision for payment APIs. Experience in fintech and agile methodologies required.',
                location: 'Remote',
                experienceRequired: 6,
                requiredSkills: ['Product Strategy', 'Agile', 'Fintech', 'SQL'],
                postedBy: jane._id
            },
            {
                title: 'iOS Developer',
                company: 'Apple',
                description: 'Building the next generation of iOS apps using Swift and SwiftUI. Deep understanding of Core Data and UIKit.',
                location: 'Cupertino, CA',
                experienceRequired: 3,
                requiredSkills: ['Swift', 'SwiftUI', 'UIKit', 'Core Data'],
                postedBy: jane._id
            },
            {
                title: 'Cybersecurity Analyst',
                company: 'Palantir',
                description: 'Identifying and mitigating security threats in large scale data systems.',
                location: 'Denver, CO',
                experienceRequired: 5,
                requiredSkills: ['Security', 'Ethical Hacking', 'Linux', 'Networking'],
                postedBy: jane._id
            },
            {
                title: 'QA Automation Engineer',
                company: 'Tesla',
                description: 'Writing automated test suites for vehicle software using Cypress and Selenium.',
                location: 'Palo Alto, CA',
                experienceRequired: 2,
                requiredSkills: ['Cypress', 'Selenium', 'JavaScript', 'Testing'],
                postedBy: jane._id
            },
            {
                title: 'Mobile App Developer (Flutter)',
                company: 'Uber',
                description: 'Creating cross-platform mobile experiences for drivers and riders using Flutter.',
                location: 'Remote',
                experienceRequired: 3,
                requiredSkills: ['Flutter', 'Dart', 'Firebase', 'Mobile Design'],
                postedBy: john._id
            },
            {
                title: 'Blockchain Engineer',
                company: 'Coinbase',
                description: 'Developing smart contracts and protocols for decentralized finance (DeFi).',
                location: 'Remote',
                experienceRequired: 4,
                requiredSkills: ['Solidity', 'Ethereum', 'Web3.js', 'Rust'],
                postedBy: jane._id
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
