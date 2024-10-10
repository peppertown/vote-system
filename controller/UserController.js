import pool from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export async function getAllUsers(req, res) {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM users');

    if (rows.length === 0) {
      return response.status(StatusCodes.NOT_FOUND).send('No users found');
    }
    res.status(StatusCodes.OK).send(rows);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
}
