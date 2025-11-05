const {client,connectDB} = require('../db/connectDb');
connectDB()
const bcrypt = require('bcrypt');
const {getToken} = require('../tokenService/token');

const handler = {
    "user.addUser": async (data) => {
        console.log("mtav");
        
        const {name,username,password} = data;

        try {
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
  } catch (error) {
     // Check if it’s the “duplicate username” error
    if (error.code === '23505') { // PostgreSQL unique_violation code
      console.error('❌ Duplicate username:', username);
      return { error: 'Username already exists. Please choose another one.' };
    }

    // Catch-all for other errors
    console.error('❌ Error adding user:', error);
    return { error: 'Failed to create user. Please try again.' };
  }
    }
}

module.exports = {handler}