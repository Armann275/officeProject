const {client,connectDB} = require('../db/connectDb');
connectDB()
const bcrypt = require('bcrypt');
const userDto = require('../dto/userDto');
const {getToken} = require('../tokenService/token');
async function createUsersTable() {

  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(query);
  console.log('🧱 users table ready');
}

async function addUser(name, username,password) {
  const hashPassword = await bcrypt.hash(password,10);  
    
    
  const query = `
    INSERT INTO users (name, username, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, username,hashPassword];
  const res = await client.query(query, values);
//   const userDtoObj = new userDto(res.rows[0].id,name,username);
    const payload = {id:res.rows[0].id,name:name,username:username}
//   console.log(userDtoObj.username);
  
  const token = getToken(payload);
//   console.log(userDtoObj);
  
  
  return {user:res.rows[0], token:token};
}

async function getAllUsers() {
  const res = await client.query('SELECT * FROM users ORDER BY id;');
  return res.rows;
}

// module.exports = {
//   createUsersTable,
//   addUser,
//   getAllUsers,
// };

// getAllUsers().then((res) =>{
//     console.log(res);
// })


addUser("artak","artak123s","poker123").then((res) => {
    console.log(res);
});
// getAllUsers().then((res) => {
//     console.log(res);
// })