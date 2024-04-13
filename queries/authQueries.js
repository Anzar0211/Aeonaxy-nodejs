const sql = require("../db");


const checkEmailExists = async (email) => {
  try {
    const result = await sql`
      SELECT COUNT(*) AS count FROM users WHERE email = ${email}
    `;
    return result[0].count > 0;
  } catch (error) {
    console.error('Error checking email existence:', error.message);
    throw error;
  }
};
const checkPhoneExists = async (phone) => {
  try {
    const result = await sql`
      SELECT COUNT(*) AS count FROM users WHERE phone = ${phone}
    `;
    return result[0].count > 0;
  } catch (error) {
    console.error('Error checking phone existence:', error.message);
    throw error;
  }
};



const registerUser = async (name, email, password, profile_picture, phone) => {
  try {
    await sql`
      INSERT INTO users (name, email, password, profile_picture, phone)
      VALUES (${name}, ${email}, ${password}, ${profile_picture}, ${phone})
    `;
    console.log('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

const findUserDetails=async(email)=>{
    try {
        const res=await sql`
            SELECT * FROM users
            WHERE email = ${email}
        `;
        return  res[0];
    } catch (error) {
        console.error('No user found with this email', error.message);
        throw error;
    }
}



module.exports={
    checkEmailExists,
    checkPhoneExists,
    registerUser,
    findUserDetails
}