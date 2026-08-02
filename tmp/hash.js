const bcrypt = require('bcryptjs');

const passwords = [
    'Hack_Escape_2026_Secure_Admin!',
    'JCC_Portal_Safe_99!',
    'Cyber_Shield_Jordan_2026'
];

async function generate() {
    console.log('--- GENERATING SECURE HASHES ---');
    for (const pw of passwords) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pw, salt);
        console.log(`Password: ${pw}`);
        console.log(`Hash: ${hash}`);
        console.log('---');
    }
}

generate();
