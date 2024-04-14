const sql=require('../db.js')

const filterFunction=async(searchTerm,category, level, popularity, offset, limit)=>{
try {
    let sqlQuery;
    if (searchTerm && category && level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' AND category=${category} AND level=${level} ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && category && level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' AND category=${category} AND level=${level} LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && category && !level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' AND category=${category} ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && category && !level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' AND category=${category} LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && !category && level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' AND level=${level} ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && !category && level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' AND level=${level} LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && !category && !level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (searchTerm && !category && !level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE title ILIKE '%' || ${searchTerm} || '%' LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && category && level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE category=${category} AND level=${level} ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && category && level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE category=${category} AND level=${level} LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && category && !level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE category=${category} ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && category && !level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE category=${category} LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && !category && level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE level=${level} ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && !category && level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses WHERE level=${level} LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && !category && !level && popularity == 1) {
        sqlQuery = sql`
            SELECT * FROM courses ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}
        `;
    } else if (!searchTerm && !category && !level && !popularity) {
        sqlQuery = sql`
            SELECT * FROM courses LIMIT ${limit} OFFSET ${offset}
        `;
    }
    else{
        sqlQuery=sql`SELECT * FROM courses`
    }
    const results=await sqlQuery;
    return results
    } catch (error) {
        return res.status(503).send('Server error');
    }


}


module.exports=filterFunction
