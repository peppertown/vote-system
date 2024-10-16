import { validationResult } from 'express-validator';

/**
 * express-validator를 사용하여 요청 매개변수를 검증하는 미들웨어입니다.
 * 검증 오류가 발견되면 400 상태 코드와 오류를 응답합니다.
 * 그렇지 않으면 다음 미들웨어 또는 라우트 핸들러로 진행합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 * @returns {void}
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validate;
