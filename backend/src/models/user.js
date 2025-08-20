const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const e = require('cors');
const AdressSchema =new mongoose.Schema({
    type : {
        type: String,
        enum: ['billing', 'shipping', 'both'],
        required: true,
    },
    street :{type: String, required: true},
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
})
const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true , trim: true},
    lastName: {type: String, required: true , trim: true},
    email : {type : String, required: true , unique: true, lowercase:true , validate: [validator.isEmail, 'Please enter a valid email']},
    password : {type: String, required:true , minlength: 7},
    phoneNumber: {type: String, required: false},
    dateofBirth: {type: Date, required: false},
    profilImage: {type: String, required: false},
    isActive: {type: Boolean, default: true},
    emailVerified: {type: Boolean, default: false},
    //address:{AdressSchema},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

//hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password
UserSchema.methods.comparePassword = async function(Password) {
    return await bcrypt.compare(Password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;