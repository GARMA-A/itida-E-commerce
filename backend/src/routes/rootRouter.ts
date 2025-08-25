import express from 'express';
import RootController from '../controllers/rootController.ts';

const router = express.Router();

router.get('/', RootController);

export default router;



