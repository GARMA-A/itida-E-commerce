import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Seller from "../../models/Seller";


const isSeller = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.cookies.accessToken;
		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
		const id = (decoded as jwt.JwtPayload).id;
		const role = (decoded as jwt.JwtPayload).role;
		if (!id) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (role !== "seller") {
			return res.status(403).json({ message: "Forbidden" });
		}
		const seller = await Seller.findOne({ _id: id });
		if (!seller) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export default isSeller;
