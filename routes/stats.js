import express from 'express';
const router = express.Router();

import showResult from '../controller/StatController.js';

router.get('/:id', showResult);

export default router;
