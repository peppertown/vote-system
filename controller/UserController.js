import pool from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';
import { randomBytes, pbkdf2Sync } from 'crypto';
import getChoseong from '../utils/getChoseong.js';
import jwt from 'jsonwebtoken'; // CJS module
import dotenv from 'dotenv';

dotenv.config();

export async function searchUsers(req, res) {
  const { searchQuery } = req.query; // TODO : 유효성 검사 시 특수문자 못받게 해야함

  try {
    const [rows, fields] = await pool.execute(
      `SELECT id, username, mbti FROM users
       WHERE username LIKE ? OR mbti LIKE ? OR choseong LIKE ?
       LIMIT 10`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`],
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    return res.status(StatusCodes.OK).send(rows);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

export async function createUser(req, res) {
  const { userName, email, password, promotionEmailConsent, mbti } = req.body;

  const passwordSalt = randomBytes(10).toString('base64');
  const passwordHash = pbkdf2Sync(
    password,
    passwordSalt,
    100000,
    10,
    'sha512',
  ).toString('base64');

  const choseong = getChoseong(userName);

  try {
    await pool.execute(
      `INSERT INTO users (username, email, password_hash, password_salt, choseong, promotion_email_consent, mbti)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userName,
        email,
        passwordHash,
        passwordSalt,
        choseong,
        promotionEmailConsent,
        mbti,
      ],
    );
    return res.status(StatusCodes.CREATED).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

export async function getUser(req, res) {
  console.log('getUser');
  const { userId } = req.params;

  try {
    const [rows, fields] = await pool.execute(
      `SELECT id, username, mbti FROM users WHERE id = ?`,
      [userId],
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    return res.status(StatusCodes.OK).send(rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

// 사용자 프로필 조회 함수
// TODO : 사용자가 생성한 surveys, responses 등도 함께 조회할 수 있게 하면 좋을듯 (담당 DB구조 확인 후 수정)
export async function getMyProfile(req, res) {
  console.log('getMyProfile');
  const token = req.cookies.token;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log(decoded);
    const [rows, fields] = await pool.execute(
      `SELECT id, username, email, email_verified, promotion_email_consent, mbti FROM users WHERE id = ?`,
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json('User not found');
    }

    return res.status(StatusCodes.OK).send(rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

// 사용자 프로필 수정 함수
// TODO : 최소한으로 수정할 수 있게 하기
// TODO : 회원가입시 이메일인증 기능을 추가하려고 하는데 email 수정기능은 없애야 할 듯
export async function updateMyProfile(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { userName, promotionEmailConsent, mbti } = req.body;

    let sql = `UPDATE users SET`;
    const values = [];

    if (userName) {
      const choseong = getChoseong(userName);
      sql += ` username = ?, choseong = ?,`;
      values.push(userName, choseong);
    }

    if (promotionEmailConsent) {
      sql += ` promotion_email_consent = ?,`;
      values.push(promotionEmailConsent);
    }

    if (mbti) {
      sql += ` mbti = ?,`;
      values.push(mbti);
    }

    // 마지막 쉼표 제거
    sql = sql.slice(0, -1);

    sql += ` WHERE id = ?;`;
    values.push(decoded.id);

    await pool.execute(sql, values);

    return res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

// 사용자 탈퇴 함수
export async function deleteMyAccount(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    await pool.execute(`DELETE FROM users WHERE id = ?`, [decoded.id]);

    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

// 비밀번호 변경 함수
export async function changeMyPassword(req, res) {
  const { newPassword } = req.body;
  const token = req.cookies.token;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const passwordSalt = randomBytes(10).toString('base64');
    const passwordHash = pbkdf2Sync(
      newPassword,
      passwordSalt,
      100000,
      10,
      'sha512',
    ).toString('base64');

    await pool.execute(
      `UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?`,
      [passwordHash, passwordSalt, decoded.id],
    );

    return res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

// 로그인 함수
// TODO 클라이언트에서 암호화해서 보내야하는지?
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const [rows, fields] = await pool.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    const user = rows[0];
    const passwordHash = pbkdf2Sync(
      password,
      user.password_salt,
      100000,
      10,
      'sha512',
    ).toString('base64');

    if (passwordHash !== user.password_hash) {
      return res.status(StatusCodes.NOT_FOUND).end(); // 보안상의 이유로 UNAUTHORIZED대신 NOT_FOUND를 응답해도 됨
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        mbti: user.mbti,
      }, // TODO : 토큰에 최소한의 정보만 담기
      JWT_SECRET,
      { expiresIn: '24h' }, // 토큰 만료 시간 설정 (24시간)
    );

    // 민감한 정보 제외하고 응답
    const { password_hash, password_salt, verification_token, ...safeUser } =
      user;

    // JWT 토큰을 쿠키에 설정
    res.cookie('token', token, {
      httpOnly: true, // 클라이언트에서 쿠키에 접근하지 못하도록 설정
      maxAge: 3600000 * 24, // 쿠키 만료 시간 설정 (24시간)
    });

    return res.status(StatusCodes.OK).json({ user: safeUser });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

// 로그아웃 함수
export async function logout(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(StatusCodes.OK).end();
  }

  res.clearCookie('token');
  return res.status(StatusCodes.OK).end();
}
