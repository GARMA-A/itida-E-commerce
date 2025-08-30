import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.accessToken;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload;
		req.userId = decoded.id as string;
		req.role = decoded.role as "user" | "admin" | "seller";
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

export default isAuthenticated;
