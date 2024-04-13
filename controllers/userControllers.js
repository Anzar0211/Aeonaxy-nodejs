const sql=require('../db.js')
const bcryptjs=require('bcryptjs');
const {getUsersQuery,updateUsersQuery}=require('../queries/userQueries');
const { errorHandler } = require('../utils/error.js');
const getUsers=async(req,res,next)=>{
    if(!req.user.isadmin){
        res.status(401).send('You are not authorised to perform this operation')
        return(next(errorHandler(401,'UNAUTHORIZED')))
    }
   try {
    const users=await getUsersQuery();
    const userswithoutpassword=users.map((user) =>{
        const{password,...rest}=user;
        return rest;
    })
    
    res.status(200).json(userswithoutpassword);
   } catch (error) {
        console.error('Error during fetching:', error.message);
        res.status(500).send('Internal server error');
   }
}

const getUserById=async(req,res,next)=>{
    const{id}=req.params;
    try {
        const resp=await sql `
        SELECT * FROM users where id=${id}
        `
        if(!resp[0]){
            return res.status(404).json({"Message":"No user found with this ID."})
        }
        const{password:pass,...rest}=resp[0];
        res.status(200).json(rest);
    } catch (error) {
        console.error('Error during fetching:', error.message);
        res.status(500).send('Internal server error');
    }
}


const updateUser=async(req,res,next)=>{
    const user=req.body;
    // const{name,email,password,profile_picture,phone}=req.body;
    const{id}=req.params;
    const updates = {};
   try {
    let resp;
    // if(req.body.name){
    //     updates.name=req.body.name;
    // }
    // if(req.body.email){
    //     updates.email=req.body.email
    // }
    //  if (req.body.password) {
    //     updates.password = bcryptjs.hashSync(req.body.password, 10);
    // }
    // if (req.body.profile_picture) {
    //     updates.profile_picture = req.body.profile_picture;
    // }
    // if (req.body.phone) {
    //     updates.phone = req.body.phone;
    // }
    const keys = Object.keys(user);
    // console.log(keys);
    const formattedKeys = keys.map(key => `'${key}'`).join(', ');
    // console.log(setQuery);
    // console.log(`
    //     UPDATE users SET ${sql(updates,formattedKeys)} WHERE id=${id};   
    // `);
    resp=await sql `
        UPDATE users SET ${sql(user,...formattedKeys)} WHERE id=${id};
    `
    // if (req.body?.name || req.body?.email || req.body?.password || req.body?.profile_picture || req.body?.phone) {
    //   // Include username update
        
    //     if(req.body?.password){
    //         user.password=bcryptjs.hashSync(req.body.password,10);
    //     }
    //     resp=await sql`
    //         update users set ${sql(user, 'name','email','password','profile_picture','phone')} where
    //         where id = ${ id }`
    // }

    // if (req.body.email) {
    //   // Include email update
    //         console.log(`
    //     update users set ${
    //         sql(user, 'email')
    //     }
    //     where id = ${ id }`);
    //         resp=await sql`
    //     update users set ${
    //         sql(user, 'email')
    //     }
    //     where id = ${ id }`
      
    // }
    

//     if (profile_picture) {
//       // Include profile picture update
//       resp=await sql`
//   update users set ${
//     sql(user, 'profile_picture')
//   }
//   where id = ${ id }`
      
//     }
    

//     if (password) {
//       // Validate password
//       if (password.length < 6) {
//         return res.status(404).send('Password must be at least 6 characters')
//       }
//       // Hash the password and include hashed password update
//       user.password=bcryptjs.hashSync(password,10);
//       resp=await sql`
//   update users set ${
//     sql(user, 'password')
//   }
//   where id = ${ id }`
      
//     }
    



    

//     if (res.length === 0) {
//       return res.status(404).send('User not found')
//     }

//     const { password, ...rest } = resp[0];
    res.status(200).json(resp);
  } catch (error) {
    console.error('Error during fetching:', error.message);
    res.status(500).send('Internal server error');
  }
}

module.exports={
    getUsers,
    updateUser,
    getUserById
}

