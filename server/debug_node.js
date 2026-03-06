const fs = require('fs');
fs.writeFileSync('starting.txt', 'Started at: ' + new Date().toISOString());

try {
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const path = require('path');

    dotenv.config({ path: path.join(__dirname, '.env') });

    if (!process.env.MONGO_URI) {
        fs.writeFileSync('error_no_uri.txt', 'No MONGO_URI');
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            fs.writeFileSync('connected.txt', 'Connected to DB');
            process.exit(0);
        })
        .catch(err => {
            fs.writeFileSync('connect_error.txt', err.message);
            process.exit(1);
        });
} catch (err) {
    fs.writeFileSync('global_error.txt', err.stack || err.message);
    process.exit(1);
}
