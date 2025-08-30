import { Response, Request } from "express";
import User from "../models/User";
import bycrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";


const login = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(400).json({ message: 'User with this email not exists' });
		}

		const accessToken = jwt.sign({
			id: user._id,
			role: "user"
		}, process.env.ACCESS_TOKEN_SECRET as string
			, { expiresIn: "15m" });

		const refreshToken = jwt.sign({
			id: user._id,
			role: "user"
		}, process.env.REFRESH_TOKEN_SECRET as string,
			{ expiresIn: "7d" });

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: 'none',
			secure: true,
		});
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 30 * 60 * 1000,
		});
		res.status(201).json({ message: 'User login successfully', user: user.email });



	} catch (error) {
		console.error('Error during signup:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};


const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).exec();
		if (user) {
			return res.status(400).json({ message: 'User with this email already exists' });
		}
		const hashedPassword = await bycrypt.hash(password, 10);
		const newUser = new User({ ...req.body, password: hashedPassword });

		const accessToken = jwt.sign({
			id: newUser._id,
			role: "user"
		}, process.env.ACCESS_TOKEN_SECRET as string
			, { expiresIn: "15m" });

		const refreshToken = jwt.sign({
			id: newUser._id,
			role: "user"
		}, process.env.REFRESH_TOKEN_SECRET as string,
			{ expiresIn: "7d" });

		await newUser.save();
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: 'none',
			secure: true,
		});
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 30 * 60 * 1000,
		});
		res.status(201).json({ message: 'User created successfully', user: newUser.email });



	} catch (error) {
		console.error('Error during signup:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};




const refresh = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	const refreshTokenCookie = cookies?.refreshToken;
	if (!refreshTokenCookie) {
		return res.status(401).json({ message: 'No refresh token found' });
	}

	jwt.verify(
		refreshTokenCookie,
		process.env.REFRESH_TOKEN_SECRET as string,
		(err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
			if (err || !decoded || typeof decoded === 'string') {
				return res.status(403).json({ message: 'Invalid refresh token' });
			}

			const payload = decoded as JwtPayload;
			const userId = payload.id;
			if (!userId) {
				return res.status(403).json({ message: 'Invalid refresh token payload' });
			}

			const newAccessToken = jwt.sign(
				{ id: userId, role: "user" },
				process.env.ACCESS_TOKEN_SECRET as string,
				{ expiresIn: '30m' }
			);

			res.cookie('accessToken', newAccessToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				maxAge: 30 * 60 * 1000,
			});
			res.status(200).json({ message: 'Access token refreshed' });
		}
	);
}

const logout = (req: Request, res: Response) => {
	try {
		(req as any).userId = undefined;
		res.clearCookie('refreshToken', {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});
		res.clearCookie('accessToken', {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});
		res.status(200).json({ message: 'Logout successful' });
	} catch (error) {
		console.error('Error during logout:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

export { login, register, refresh, logout };
