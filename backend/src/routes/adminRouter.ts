import express from 'express'
const adminRoutes=express.Router()
import { checkPermission } from "../middlewares/permessions.ts";
import {approveRejectProduct,updateProductCategory,toggleFeaturedProduct,checkInventory,getAllAdmin,addNewAdmin, getAllUser,searchUser,toggleUserStatus,deleteUser,resetUserPassword,getAllSellers,verifySeller,toggleSellerStatus,updateCommissionRate} from "../controllers/adminController.ts"
import { Permissions } from "../utils/permissions.ts"
adminRoutes.get('/admins',getAllAdmin)//tmam 
adminRoutes.post('/adminss',addNewAdmin)//tmam 
adminRoutes.get("/users",getAllUser);//tmam 
adminRoutes.get("/users/:id",searchUser);//tmam 
adminRoutes.put("/users/:id/status",toggleUserStatus);//tmam 
adminRoutes.delete("/users/:id",deleteUser);//tmam 
adminRoutes.post("/users/:id/reset-password",resetUserPassword);//tmam 
adminRoutes.get('/sellers',getAllSellers);//tmam 
adminRoutes.put('/sellers/:id/verify',verifySeller);//tmam 
adminRoutes.put('/sellers/:id/status',toggleSellerStatus);//tmam 
adminRoutes.put('/sellers/:id/commission',updateCommissionRate);//tmam 
adminRoutes.put('/products/:id/approve',approveRejectProduct);//tmam 
adminRoutes.put('/categories/:id',updateProductCategory);//tmam 
adminRoutes.put('/products/:id/feature',toggleFeaturedProduct);//tmam 
adminRoutes.get('/products/inventory',checkInventory);//tmam
export default adminRoutes;
// adminRoutes.get('/admins',checkPermission(Permissions.ADMINS[0]),getAllAdmin);
// adminRoutes.post('/adminss',checkPermission(Permissions.ADMINS[1]),addNewAdmin);
// adminRoutes.get("/users",checkPermission(Permissions.USERS[0]),getAllUser);
// adminRoutes.get("/users/:id",checkPermission(Permissions.USERS[0]),searchUser);
// adminRoutes.put("/users/:id/status",checkPermission(Permissions.USERS[1]),toggleUserStatus);
// adminRoutes.delete("/users/:id",checkPermission(Permissions.USERS[2]),deleteUser);
// adminRoutes.post("/users/:id/reset-password",checkPermission(Permissions.USERS[1]),resetUserPassword);
// adminRoutes.get('/sellers',checkPermission(Permissions.SELLERS[0]),getAllSellers);
// adminRoutes.put('/sellers/:id/verify',checkPermission(Permissions.SELLERS[2]),verifySeller);
// adminRoutes.put('/sellers/:id/status',checkPermission(Permissions.SELLERS[1]),toggleSellerStatus);
// adminRoutes.put('/sellers/:id/commission',checkPermission(Permissions.SELLERS[1]),updateCommissionRate);
// adminRoutes.put('/products/:id/approve',checkPermission(Permissions.PRODUCTS[2]),approveRejectProduct);
// adminRoutes.put('/categories/:id',checkPermission(Permissions.PRODUCTS[1]),updateProductCategory);
// adminRoutes.put('/products/:id/feature',checkPermission(Permissions.PRODUCTS[2]),toggleFeaturedProduct);
// adminRoutes.get('/products/inventory',checkPermission(Permissions.PRODUCTS[0]),checkInventory);
