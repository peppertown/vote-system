const express = require('express');
const {
	CreateMBTI,
	MBTI_Update,
	GetMBTIText,
	GetMBTIData
} = require('../Controller/mbtiController');

const router = express.Router();

router.use(express.json());

router.post('/createMBTI', CreateMBTI);

router.post('/vote', MBTI_Update);

router.get('/getMBTI', GetMBTIText);

router.post('/getMBTIData', GetMBTIData);

module.exports = router;
