// createConnection
// 장점: 단일 연결을 사용하므로 간단한 애플리케이션에 적합합니다.
// 단점: 여러 요청이 동시에 들어올 경우 성능이 저하될 수 있습니다. 연결이 끊어지면 수동으로 다시 연결해야 합니다.
// createPool
// 장점: 연결 풀을 사용하여 여러 연결을 관리하므로, 동시에 여러 요청을 처리할 수 있습니다. 연결이 끊어지면 자동으로 다시 연결됩니다.
// 단점: 설정이 약간 더 복잡할 수 있습니다.

// Get the client
import mysql from "mysql2/promise";

// Create the connection to database
// 환경변수에 DB_NAME을 추가해주세요.
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: Process.env.DB_NAME,
  dateStrings: true,
});

// Create the connection pool to database
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: Process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   dateStrings: true,
// });

export default connection;
