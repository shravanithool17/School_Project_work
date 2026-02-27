const bcrypt = require('bcryptjs');

// Hash password utility
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Usage: node src/utils/hashPassword.js
if (require.main === module) {
    const password = process.argv[2] || 'admin123';
    hashPassword(password).then(hash => {
        console.log('Password:', password);
        console.log('Hash:', hash);
        console.log('\nUse this hash in your database INSERT statement');
    });
}

module.exports = hashPassword;
