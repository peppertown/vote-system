import pool from '../mariadb.js';

const showResult = async (req, res) => {
  res.json('hello world');
};

export default showResult;
