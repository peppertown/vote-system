import express from 'express';
const router = express.Router();
router.use(express.json());

import utils from '../controller/StatController.js';

router.get('/detail/:id', utils.showMostChoiced);
router.get('/:id', utils.showResult);

export default router;
