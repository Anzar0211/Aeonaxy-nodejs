const sql=require('../db.js');
const filterFunction  = require('../utils/filters');

//Creating a new Course(Exclusive for admin)

const createCourse=async(req,res,next)=>{
    try{
        if(!req.user.isadmin){
            console.log('Not Allowed ! You are not an Admin');
            return res.status(401).send("You are not authorized to perform this action");
        }
        const{title,description,category,level,popularity}=req.body
        if(!title || !description || !category || !level || !popularity){
            return res.status(400).send('All fields are required');
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
        return res.status(500).send(`Error creating course: ${e}`)
    }
}

//Getting a course by its unique id (public route)
const getCourseById=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const resp=await  sql`SELECT * FROM courses WHERE id=${id};`;
        if (!resp[0]) {
            return res.status(404).json({
                status: "fail",
                message: "No course with the given ID was found."
            });
        }
        res.status(200).json({
            status: "success",
            data:resp[0]
        });
    } catch (error) {
        console.log('Could not fetch course');
        return res.status(500).json('Internal Server Error')
    }
}


//Get all courses with features like  pagination and search (Public route)
const getAllCourses=async(req,res,next)=>{
    try{
        const {searchTerm,category, level, popularity, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const results=await filterFunction(searchTerm,category,level,popularity,offset,10)
        console.log('ALL COURSES FETCHED SUCCESSFULLY');
        res.status(200).json(results);
    }
    catch(e){
        return res.status(400).json('Error in retrieving data');
    }
}


//Update a course(Exclusive for admin)
const updateCourse=async(req,res,next)=>{
    if(!req.user.isadmin){
        console.log('You are not allowed to update  this resource!');
        return res.status(401).send("You are not authorized to perform this action");
    }
    try {
        const{title, description, category,level,popularity}=req.body;
        const{id}=req.params;
        if(title){
            const titleSlug=title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
            const randomNumber = Math.floor(Math.random() * 9999999) + 1;
            const slug = `${titleSlug}-${randomNumber}`;
            await sql`UPDATE courses set title=${title},slug=${slug} WHERE id=${id};`;
        }
        if(description){
            await sql`UPDATE courses SET description=${description} WHERE id=${id}`;
        }
        if(category){
            await sql`UPDATE courses SET category=${category} WHERE id=${id}`
        }
        if(level){
            await sql`UPDATE courses SET level=${level} WHERE id=${id}`
        }
        if(popularity){
            await sql`UPDATE courses SET popularity=${popularity} where id=${id}`
        }
        console.log('Course has been updated');
        res.status(200).json({message:"The course has been updated"});
    } catch (error) {
        console.log('There was an error updating the course',error);
        res.status(500).json({message:'An error occured when trying to update the course'})
    }

}


//Delete a course(Exclusive for admin)
const deleteCourse= async(req,res,next)=> {
    if(!req.user.isadmin){
        console.log('You are not allowed to delete a post');
        return res.status(401).send("You are not authorized to perform this action");
    }
    try {
        const{id}=req.params;
        const resp=await sql`
            DELETE FROM courses WHERE id = ${id};
        `
        res.status(200).send('deleted successfully')
    } catch (error) {
        return res.status(400).send('Server Error')
    }
}

module.exports={
    getAllCourses,
    createCourse,
    deleteCourse,
    getCourseById,
    updateCourse,
}

