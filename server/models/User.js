const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:    { type:String, required:true, unique:true, lowercase:true, trim:true },
    password: { type:String, required:true, minLength:6 },
}, { timestamps:true });

// mongoose pre-save hook to hash password before it gets stored
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next(); // only rehashes if password actually changed
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// check passwords at login
userSchema.methods.comparePassword = function(candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);