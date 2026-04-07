const bcrypt = require('bcryptjs');
const fs = require('fs');
const pw = 'Hack_Escape_2026_Secure_Admin#';
bcrypt.hash(pw, 10).then(hash => {
    fs.writeFileSync('scripts/hash-output.txt', hash);
    console.log('HASH_WRITTEN');
});
