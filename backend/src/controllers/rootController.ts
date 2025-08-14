import type { Request, Response } from 'express';

function RootController(req: Request, res: Response) {
	res.status(200).json({ message: 'Welcome to the API' });
}
export default RootController;
