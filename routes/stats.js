import express from 'express';
const router = express.Router();
router.use(express.json());

import showResult from '../controller/StatController.js';

router.get('/:id', showResult);

export default router;
