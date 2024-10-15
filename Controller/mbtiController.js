const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const CreateMBTI = (req, res) => {
	//userId는 JWT 검증용
	const { userId, mbti_data } = req.body;

	// 회원가입 시 할 것인지,
	return GetMBTI(mbti_data);

	// 따로 MBTI 검사를 할 수 있어서 검사 후 관련 서비스를 이용할 수 있게 할 것인 지
	let query = `UPDATE users SET mbti = JSON_OBJECT(
                'extrovert', ?, 
                'sensing', ?, 
                'thinking', ?, 
                'judging', ?
             ) WHERE userId = ?`;

	let values = [
		mbti_data.extrovert,
		mbti_data.sensing,
		mbti_data.thinking,
		mbti_data.judging,
		userId
	];

	conn.query(query, values, (err, result) => {
		if (err) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Failed to update MBTI',
				error: err
			});
		}
		if (result.affectedRows > 0) {
			res.status(StatusCodes.CREATED).json({
				message: 'MBTI updated successfully'
			});
		} else {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Failed to update MBTI'
			});
		}
	});
};

// 사용자가 설문에 응답할 시 설문에 AI로 설정된 데이터 값을 통해 사용자의 MBTI 비율을 수치로 변동
const MBTI_Update = (req, res) => {
	const { userId, question_mbti_data } = req.body;

	let query = `UPDATE users 
             SET mbti = JSON_SET(
                mbti,
                '$.extrovert', JSON_EXTRACT(mbti, '$.extrovert') + ?,
                '$.sensing', JSON_EXTRACT(mbti, '$.sensing') + ?,
                '$.thinking', JSON_EXTRACT(mbti, '$.thinking') + ?,
                '$.judging', JSON_EXTRACT(mbti, '$.judging') + ?
             )
             WHERE userId = ?`;

	let values = [
		question_mbti_data.extrovert,
		question_mbti_data.sensing,
		question_mbti_data.thinking,
		question_mbti_data.judging,
		userId
	];

	conn.query(query, values, (err, result) => {
		if (err) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Failed to update MBTI',
				error: err
			});
		}
		if (result.affectedRows > 0) {
			res.status(StatusCodes.OK).json({
				message: 'MBTI updated successfully'
			});
		} else {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Failed to update MBTI'
			});
		}
	});
};

// MBTI에 있는 JSON 데이터 출력
const GetMBTIData = (req, res) => {
	const { userId } = req.params;
	let query = `SELECT mbti FROM users WHERE user_id =?`;

	conn.query(query, userId, (req, res) => {
		if (res.length > 0) {
			res.status(StatusCodes.OK).json(res[0].mbti);
		} else {
			res.status(StatusCodes.NOT_FOUND).json({
				message: 'MBTI not found'
			});
		}
	});
};

const GetMBTIText = (req, res) => {
	let MBTI = '';

	let query = `SELECT mbti FROM users WHERE user_id =?`;

	conn.query(query, userId, (req, res) => {
		if (res.length > 0) {
			res[0].mbti.extrovert >= 50 ? (MBTI += 'E') : (MBTI += 'I');
			res[0].mbti.sensing >= 50 ? (MBTI += 'S') : (MBTI += 'N');
			res[0].mbti.thinking >= 50 ? (MBTI += 'T') : (MBTI += 'F');
			res[0].mbti.judging >= 50 ? (MBTI += 'J') : (MBTI += 'P');
			res.status(StatusCodes.OK).end();
			return MBTI;
		} else {
			res.status(StatusCodes.NOT_FOUND).json({
				message: 'MBTI not found'
			});
		}
	});
};

module.exports = { CreateMBTI, MBTI_Update, GetMBTIText, GetMBTIData };
