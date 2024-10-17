import { Router } from 'express';
import {
  addQuestion,
  allQuestion,
  editQuestion,
  editOptions,
  deleteQuestion,
  deleteOptions,
} from '../controller/QuestionController.js';
const router = Router();

router.post('/:id/questions', addQuestion); // 질문 추가
router.get('/:id/questions', allQuestion); // 질문 조회
router.patch('/:id/questions/:question_id', editQuestion); // 질문 수정
router.patch('/:id/questions/:question_id/options/:option_id', editOptions); // 질문 옵션 수정
router.delete('/:id/questions', deleteQuestion); // 질문 삭제
router.delete('/:id/questions/:question_id/options/:option_id', deleteOptions); // 질문 옵션 삭제

// 모듈화
export default router;
