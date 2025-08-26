import { Request, Response } from "express";
import Seller from "../models/Seller";
import Product from "../models/Product";

export const createSeller = async (req: Request, res: Response) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.status(201).json(seller);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getSeller = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ error: "Seller not found" });
    res.json(seller);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSeller = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!seller) return res.status(404).json({ error: "Seller not found" });
    res.json(seller);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSeller = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    seller.isActive = false;
    await seller.save();

    await Product.updateMany({ sellerId: req.params.id }, { active: false });

    res.json({ message: "Seller deactivated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyDocuments = async (req: Request, res: Response) => {
  try {
    const { status, reason } = req.body;
    const seller = await Seller.findById(req.params.id);

    if (!seller) return res.status(404).json({ error: "Seller not found" });

    seller.verificationStatus = status;
    await seller.save();

    res.json({ message: `Seller verification status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listSellers = async (req: Request, res: Response) => {
  try {
    const { businessType, verificationStatus, isActive } = req.query;
    const filter: any = {};

    if (businessType) filter.businessType = businessType;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const sellers = await Seller.find(filter)
      .select("-bankAccountInfo -verificationDocuments")
      .sort({ createdAt: -1 });

    res.json(sellers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSellerStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    );

    if (!seller) return res.status(404).json({ error: "Seller not found" });

    res.json(seller);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSellerDashboard = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const productCount = await Product.countDocuments({
      sellerId: req.params.id,
      active: true,
    });

    const salesData = {
      totalSales: seller.totalSales,
      monthlySales: 0,
      weeklySales: 0,
    };

    const ratingSummary = {
      average: seller.rating,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    res.json({
      sellerInfo: seller,
      productCount,
      salesData,
      ratingSummary,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
