import express from 'express';
const router = express.Router();

import utils from '../controller/StatController.js';

router.get('/detail/:id', utils.showMostChoiced);
router.get('/:id', utils.showResult);

export default router;
