const pool = require("../db");
const md5 = require("md5");

const getUser = async (user, pass) => {
  const query = "select * from users where userName = ? and userPass = ?";
  const row = await pool.query(query, [user, md5(pass)]);
  return row[0];
  
};

const addUser = async (user, email, pass) => {
  try {
      const query = "insert into users set ?";
      const row = await pool.query(query, [user, email, pass]);
      return row[0];
      
      
  } catch (error) {
      console.log(error);
  }
}


module.exports = { getUser, addUser };