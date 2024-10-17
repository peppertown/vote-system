import express from 'express';
const router = express.Router();

import { showResult, showMostChoiced } from '../controller/StatController.js';

router.get('/:id/stats', showResult);
router.get('/:id/stats/detail', showMostChoiced);

export default router;
