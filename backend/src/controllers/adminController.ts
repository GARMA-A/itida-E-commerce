import adminModel from "../models/admin.ts"
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../models/User.ts";
import Seller from '../models/sellers.ts';
import Product from '../models/product.ts';
var getAllAdmin=async (req,res)=>{
    try {
        var Admins = await adminModel.find();
        res.status(200).json({ message: "all Admins", Admins });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const addNewAdmin=async(req,res)=>{
    try{
        var Admin=req.body;
        const newAdmin=await adminModel.create(Admin);
        res.status(201).json({message:"new Admin created"},newAdmin)
    }catch(err){
        res.status(404).json({message: err.message})
    }
};
var getAllUser=async (req,res)=>{
    try {
        var users = await userModel.find();
        res.status(200).json({ message: "all users", users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
var searchUser=async (req,res)=>{
try{
    const {id}=req.params;
    const user=await userModel.findById(id);
    if(!user){
    res.status(404).json({message:"Sorry, user not found"})
    return ;
    }
    res.status(200).json(user)
}catch(err){
    res.status(500).json({ error: err.message });
}
}
var deleteUser=async (req,res)=>{
try {
    const {id}=req.params;
    const deleteuser=await userModel.findOneAndDelete({_id: id})
    if(!deleteuser){
        return res.status(404).json({ message: "Sorry, user not found" });
    }
    res.status(201).json({message:"user deleted successfully"})
} catch (error) {
    res.status(500).json({ error: error.message });
}
}
const toggleUserStatus=async(req,res)=>{
    try{
        const user=await userModel.findById(req.params.id);
        if(!user)return res.status(404).json({message:'User not found'});
        user.status=!user.status;
        await user.save();
        res.json({message:`User is now ${user.status ?'active':'inactive'}`,user});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
const resetUserPassword=async(req, res)=>{
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const newPassword = req.body.newPassword;
        if (!newPassword || newPassword.length < 6) 
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const salt = await bcrypt.genSalt(15);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 const getAllSellers = async (req, res) => {
  try {
    const sellers=await Seller.find();
    res.json(sellers);
  } catch (err) {
    res.status(500).json({message:err.message});
  }
};
const verifySeller=async(req,res)=>{
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller)
        return res.status(404).json({message:'Seller not found'});
    seller.verified = true;
    await seller.save();
    res.json({message:'Seller verified',seller});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};
const toggleSellerStatus=async(req,res)=>{
  try {
    const seller=await Seller.findById(req.params.id);
    if(!seller)
        return res.status(404).json({message:'Seller not found'});
    seller.status=seller.status==='active'?'suspended':'active';
    await seller.save();
    res.json({message:`Seller status is now ${seller.status}`,seller});
  } catch (err) {
    res.status(500).json({message:err.message });
  }
};
const updateCommissionRate=async(req,res)=>{
  try {
    const {commissionRate}=req.body;
    const seller = await Seller.findById(req.params.id);
    if (!seller) 
        return res.status(404).json({message:'Seller not found'});
    seller.commissionRate=commissionRate;
    await seller.save();
    res.json({message:'Commission rate updated',seller});
  } catch (err){
    res.status(500).json({message:err.message});
  }
};
const approveRejectProduct=async(req, res) => {
  try {
    const{status}=req.body;
    const product=await Product.findById(req.params.id);
    if (!product)
        return res.status(404).json({message:'Product not found'});
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    product.status = status;
    await product.save();
    res.json({ message: `Product ${status}`, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateProductCategory=async(req,res) => {
  try {
    console.log(req.body);
    const{category}=req.body;
    const product=await Product.findById(req.params.id);
    if (!product) 
        return res.status(404).json({ message: 'Product not found' });
    product.category=category;
    await product.save();
    res.json({ message: 'Category updated', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const toggleFeaturedProduct=async(req,res) => {
  try {
    const product=await Product.findById(req.params.id);
    if(!product) 
        return res.status(404).json({ message: 'Product not found' });
    product.featured=!product.featured;
    await product.save();
    res.json({ message: `Product is now ${product.featured ? 'featured' : 'not featured'}`, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const checkInventory=async(req,res) => {
  try {
    const lowStockThreshold=5;
    const lowStockProducts=await Product.find({stock:{$lte:lowStockThreshold}});
    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { approveRejectProduct,updateProductCategory,toggleFeaturedProduct,checkInventory,getAllAdmin, addNewAdmin, getAllUser,searchUser,toggleUserStatus,deleteUser,resetUserPassword,getAllSellers,verifySeller,toggleSellerStatus,updateCommissionRate};
