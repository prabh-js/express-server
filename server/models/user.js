const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();

    }
    catch (err) {
        return next(err);
    }
});
userSchema.methods.comparePassword = async function(candidatePassword, callback) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        callback(null, isMatch);
    }
    catch(err) {
            return callback(err);
    }
    
}


const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;