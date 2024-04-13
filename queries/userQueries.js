const sql=require('../db.js')

const getUsersQuery=async()=>{
    try {
        const res=await sql`
        SELECT * FROM users
        `;
        return res;
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
}

module.exports={
    getUsersQuery
}