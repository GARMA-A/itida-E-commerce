import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },password:{ 
    type: String,
    minlength: 8
  },
  adminLevel: {
    type: String,
    enum: ['admin', 'super_admin', 'moderator'],
  },
  department: {
    type: String,
    enum: [
      'customer_service',
      'seller_management',
      'product_moderation',
      'finance',
      'technical'
    ]
  },
  permissions: {
    type: [String],
    default: []
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true 
  },
  hireDate: {
    type: Date,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String 
  }
}, {
  timestamps:true 
});
adminSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();  
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
var adminModel=mongoose.model("admin",adminSchema)
export default adminModel;