import kMaxLength from "buffer";
import mongoose from "mongoose";
import bcrypt from'bcrypt';
import { boolean } from "webidl-conversions";
const userSchema=new mongoose.Schema({
    name:{type:String,
        required:[true,"name is required"],
        minlength:[7],
        maxlength:[30]
    },age:{
        type:Number,
        required:[true,"age is required"],
    },email:{
        type:String
    },password:{
        type:String
    },status:{
        type:Boolean,
    }
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();  
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

var userModel=mongoose.model("user",userSchema)
export {userModel}
