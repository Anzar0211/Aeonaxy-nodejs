const {errorHandler}=require('../utils/error');
const sql=require('../db.js')

const createCourse=async(req,res,next)=>{
    try{
        // console.log(req.user);
        console.log(req.user);
        if(!req.user.isadmin){
            res.status(401).send("You are not authorized to perform this action");
            return next(errorHandler(403,'You are not allowed to create a post'));
        }
        const{title,description,category,level,popularity}=req.body
        if(!title || !description || !category || !level || !popularity){
            return next(errorHandler(400,'All Fields are required!!'))
        }
        const titleSlug=title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
        const randomNumber = Math.floor(Math.random() * 9999999) + 1;
        const slug = `${titleSlug}-${randomNumber}`;
        const newCourse=await sql `
        INSERT INTO courses (title, description, category, level, popularity,slug)
        VALUES (${title}, ${description}, ${category}, ${level}, ${popularity},${slug})
        `;
        res.status(201).json({
            status:'success',
            message:"course created"
        })
    }catch(e){
        console.log(e);
        return next(errorHandler(500,"Server error"));
    }
}


const getAllCourses=async(req,res,next)=>{
    try{
        let sqlQuery
        const {searchTerm,category, level, popularity, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        if(searchTerm && !popularity){
            sqlQuery=await sql `SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' LIMIT ${limit} OFFSET ${offset}`;
            
        }
        else if(searchTerm && popularity==1){
            sqlQuery=await sql `SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}`;
        }
        else if(category && !popularity){
            sqlQuery=await sql`SELECT * FROM courses WHERE title LIKE ${searchTerm} AND category=${category} LIMIT ${limit}  OFFSET ${offset};`
        }
        else if (!category && popularity==1) {
            sqlQuery=await sql`SELECT * FROM courses ORDER BY popularity DESC LIMIT ${limit} OFFSET  ${offset};`;
        }
        else if (category && popularity==1){
            sqlQuery=await sql`SELECT * FROM courses WHERE category=${category} ORDER BY popularity DESC LIMIT ${limit} OFFSET  ${offset};`;
        }
        else{
            sqlQuery=await sql`SELECT * FROM courses;`
        } 
        res.status(200).json(sqlQuery);
    }
    catch(e){
        res.status(400).json('Error in retrieving data');
        return next(errorHandler(e,"Error in getting all the courses"))
    }
}

const deleteCourse= async(req,res,next)=> {
    if(!req.user.isadmin){
            res.status(401).send("You are not authorized to perform this action");
            return next(errorHandler(403,'You are not allowed to delete a post'));
        }
    try {
        const{id}=req.params;
        const resp=await sql`
            DELETE FROM courses WHERE id = ${id};
        `
        res.status(200).send('deleted successfully')
    } catch (error) {
        next(errorHandler(error,'Failed to delete course'));
    }
}

module.exports={
    getAllCourses,
    createCourse,
    deleteCourse
}

