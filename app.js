// app.js
const express=require('express')
const cookieParser=require('cookie-parser')
const app=express();
require('dotenv').config();
const PORT=3000
const userRoutes=require('./routes/userRoutes')
const authRoutes=require('./routes/authRoutes')
const courseRoutes=require('./routes/courseRoutes')
const enrollmentRoutes=require('./routes/enrollmentRoutes')
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("HELLO WORLD")
})

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/courses",courseRoutes);
app.use("/api/v1/enrollments",enrollmentRoutes)

app.listen(PORT, () => {

  console.log(`Listening on ${PORT}`);

});