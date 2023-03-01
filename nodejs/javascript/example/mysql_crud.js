import mysql from "mysql2";
import Config from "../config.js";

/**
 * 插入一行记录
 */
function createRow() {
  const sql = "INSERT INTO user (name, age) VALUES (?, ?)";
  const values = ["userA", 1];

  connection.query(sql, values, (error, results) => {
    if (error) {
      throw error;
    }

    // 获取插入记录的行数
    console.log("insert rows:", results.affectedRows);
    // 获取插入记录的自增 ID
    console.log("insert row id:", results.insertId);
  });
}

/**
 * 插入多行记录
 */
function createRows() {
  const sql = "INSERT INTO user (name, age) VALUES ?";
  const values = [
    [
      ["userB", 2],
      ["userC", 3],
      ["userD", 4],
    ],
  ];

  connection.query(sql, values, (error, results) => {
    if (error) {
      throw error;
    }

    // 获取插入记录的行数
    console.log("insert rows:", results.affectedRows);
  });
}

/**
 * 读取记录
 */
function readRows() {
  const sql = "SELECT id, name, age from user WHERE id = ? OR name = ?";
  const values = [1, "userB"];

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      throw error;
    }

    console.log("read rows:", results.length);

    results.forEach((row) => {
      const id = row.id;
      const name = row.name;
      const age = row.age;

      console.log(`id: ${id}, name: ${name}, age: ${age}`);
    });

    const names = fields.map((field) => field.name);
    console.log("column names:", names);
  });
}

/**
 * 更新记录
 */
function updateRows() {
  const sql = "UPDATE user SET age = ? WHERE name = ?";
  const values = [40, "userD"];

  connection.query(sql, values, (error, results) => {
    if (error) {
      throw error;
    }

    // 获取更新记录的行数
    console.log("update rows:", results.changedRows);
  });
}

/**
 * 删除记录
 */
function deleteRows() {
  const sql = "DELETE FROM user WHERE age = ?";
  const values = [40];

  connection.query(sql, values, (error, results) => {
    if (error) {
      throw error;
    }

    // 获取删除记录的行数
    console.log("delete rows:", results.affectedRows);
  });
}

const connection = mysql.createConnection({
  host: Config.mysql_host,
  port: Config.mysql_port,
  user: Config.mysql_user,
  password: Config.mysql_password,
  database: Config.mysql_db_example,
});

connection.connect();

createRow();
createRows();
readRows();
updateRows();
deleteRows();

connection.end();
