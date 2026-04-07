const bcrypt = require('bcryptjs');
const pw = 'Hack_Escape_2026_Secure_Admin#';
bcrypt.hash(pw, 10).then(hash => {
    console.log('FULL_HASH_START');
    console.log(hash);
    console.log('FULL_HASH_END');
});
