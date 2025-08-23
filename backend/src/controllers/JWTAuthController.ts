import { Response, Request } from "express";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";



const register = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !password || !email || !email.includes('@') || !email.includes('.') || password.length < 6) {
			return res.status(400).json({
				message: 'Username, password, and valid email are required.Password must be at least 6 characters.'
			});
		}
		// const user = await User.findOne({ email }).exec();
		// if (user) {
		// 	return res.status(400).json({ message: 'User with this email already exists' });
		// }
		// const hashedPassword = await bycrypt.hash(password, 10);
		// const newUser = new User({ username, email, password: hashedPassword });
		//
		// const accessToken = jwt.sign({
		// 	id: newUser._id
		// }, process.env.ACCESS_TOKEN_SECRET as string
		// 	, { expiresIn: "15m" });
		//
		// const refreshToken = jwt.sign({
		// 	id: newUser._id
		// }, process.env.REFRESH_TOKEN_SECRET as string,
		// 	{ expiresIn: "7d" });
		//
		// await newUser.save();
		// res.cookie('refreshToken', refreshToken, {
		// 	httpOnly: true,
		// 	maxAge: 7 * 24 * 60 * 60 * 1000,
		// 	sameSite: 'none',
		// 	secure: true,
		// });
		// res.cookie('accessToken', accessToken, {
		// 	httpOnly: true,
		// 	secure: true,
		// 	sameSite: 'none',
		// 	maxAge: 30 * 60 * 1000,
		// });
		// res.status(201).json({ message: 'User created successfully', user: newUser.email });



	} catch (error) {
		console.error('Error during signup:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
