const sql=require('../db.js')
const bcryptjs=require('bcryptjs');
const {getUsersQuery,updateUsersQuery}=require('../queries/userQueries');


//Get all users details except password(Exclusive for admin)
const getUsers=async(req,res,next)=>{
    if(!req.user.isadmin){
        console.log('Not allowed to perform this action');
        res.status(401).send('You are not authorised to perform this operation')
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


//Sign out a currently signed in user
const signOut=(req,res,next)=>{
    try{
        res.clearCookie('access_token').status(200).json('User has been Signed Out!!')
    }catch(e){
        console.log(e.message);
        return res.status(404).send('Something went wrong while signing out!')
    }
}

//get a particular users information by id(Public route)
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

//Update  the profile of a logged-in user
const updateUser=async(req,res,next)=>{
    const{name,email,password,profile_picture,phone}=req.body;
    let hashedPass;
    try {
        const id=req.user.id;
        if(name){
            await sql `UPDATE users SET name=${name} where id=${id}`
        }
        if(email){
            await sql `UPDATE users SET email=${email} where id=${id}`
        }
        if(password){
            hashedPass=bcryptjs.hashSync(password,10);
            await sql `UPDATE users SET password=${hashedPass} where id=${id}`
        }
        if(profile_picture){
            await sql `UPDATE users SET profile_picture=${profile_picture} where id=${id}`
        }
        if(phone){
            await sql `UPDATE users SET phone=${phone} where id=${id}`
        }   
        
        console.log('USER UPDATED SUCCESSFULLY');
        res.status(200).json('USER UPDATED SUCCESSFULLY');
    } catch (error) {
        console.log('Could not update user');
        return res.status(400).json('INTERNAL SERVER ERROR')
    }       
}

module.exports={
    getUsers,
    updateUser,
    getUserById,
    signOut
}

