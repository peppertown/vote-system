import { Router } from 'express';
import {
  searchUsers,
  createUser,
  getUser,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  changeMyPassword,
  login,
  logout,
  checkEmailExists,
} from '../controller/UserController.js';
import { param, query, body } from 'express-validator';
import validate from '../utils/validate.js';

const router = Router();

// GET /users usersname, mbti로 유저 검색
router.get(
  '/',
  [
    query('searchQuery')
      .isString()
      .withMessage('searchQuery는 문자열이어야 합니다.')
      .isLength({ min: 2, max: 20 })
      .withMessage('searchQuery는 2글자 이상 20글자 이하여야 합니다.')
      .matches(/^[a-zA-Z0-9가-힣]*$/)
      .withMessage('searchQuery는 특수문자를 포함할 수 없습니다.'),
    validate,
  ],
  searchUsers,
);

// POST /users 회원가입
router.post('/', createUser);

// GET /users/me 내 정보 조회
router.get('/me', getMyProfile);

// PATCH /users/me 내 정보 수정
router.patch('/me', updateMyProfile);

// DELETE /users/me 회원탈퇴
router.delete('/me', deleteMyAccount);

// PATCH /users/me/password 비밀번호 변경
router.patch('/me/password', changeMyPassword);

// POST /users/auth 로그인
router.post('/auth', login);

// DELETE /users/auth 로그아웃
router.delete('/auth', logout);

// GET /users/emails 이메일 중복 여부 확인
router.get('/check-email', checkEmailExists);

// GET /users/:userId 유저 정보 조회
router.get('/:userId', getUser);

// TODO
// 비밀번호 초기화

export default router;
