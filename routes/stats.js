import express from 'express';
const router = express.Router();

import utils from '../controller/StatController.js';

router.get('/:id/stats', utils.showResult);
router.get('/:id/stats/detail', utils.showMostChoiced);

export default router;
