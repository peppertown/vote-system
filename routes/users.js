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
} from '../controller/UserController.js';

const router = Router();

// GET /users usersname, mbti로 유저 검색
router.get('/', searchUsers);

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

// GET /users/:userId 유저 정보 조회
router.get('/:userId', getUser);

// POST /users/auth 로그인
router.post('/auth', login);

// DELETE /users/auth 로그아웃
router.delete('/auth', logout);

// TODO
// 비밀번호 변경
// 비밀번호 초기화

export default router;
