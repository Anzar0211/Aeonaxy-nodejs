This is a course enrollment api where registered users can search for courses and enroll into courses of their interest
It would be more intuitive and user friendly if the requests are sent through a API testing tool such as postman.
The following are the the endpoints for the api.

 //NOTE THAT values within quotea are strings whereas without quotes are numeric values.For Example phone is a numeric value.

AUTH ROUTES
1) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/signup
  (POST REQUEST WITH THE req.body having name,email,password,profile_picture(image url),phone(10 digits))
  The JSON in the req.body shall have the following format.

 
  {
  
      "name":"YOUR USERNAME",
      "email":"YOUR EMAIL ID",                       //Enter a valid email id to recieve verification email
      "password":"YOUR PASSWORD",                     //Should be at least 8 characters and alphanumeric),,
      "profile_picture": "YOUR IMAGE URL",             //enter a valid image url to store your image in cloudinary database
      "phone":YOUR 10 DIGIT PHONE NUMBER
      
  }

  
2) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/signin
   (POST REQUEST WITH THE req.body having email and password to login the user to their respective accounts.For added security you can only login to your email account if you have verified your email through the verification link sent to your email account)
   
   The JSON in the req.body shall have the following format.

   {
     "email":"YOUR EMAIL ID",                      //Enter your registered email id
     "password":"YOUR PASSWORD"                    //Enter your account password
   }

   
3) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/requestEmailVerification      //For the case user wants to requests another verification link sent to their email
  (POST REQUEST WITH THE req.body having email)

  The JSON in the req.body shall have the following format.
  {
    "email":"YOUR EMAIL ID"

  }

4) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/resetPassword                  //Request to reset password
  (POST REQUEST with the req.body having your email id)

  The JSON in the req.body shall have the following format.
  {
    "email":"YOUR EMAIL ID"                                                           // A reset link would be sent to the email id.
  }

  //After recieving the verification email copy the link and send a PUT REQUEST on that link with the req.body consisting of the new password for successfully resetting the password
  
  {
    "newPassword":"ENTER NEW PASSWORD"
  }


  USER ROUTES

1)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/user
    (GET REQUEST but this route is exclusive for an ADMIN)

2)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/user/:id
    (GET REQUEST to find an user by id)  //Can be used when an user wants to view another user's profile from the frontend side.

3)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/user/update/:id
    (PUT REQUEST using which an a registered user can update their respective profiles)
    
    The JSON in the req.body shall have the following format.(At least one field is required for the updation process)
    {
      "name":"YOUR USERNAME",                        //Optional field
      "email":"YOUR EMAIL ID",                       //Optional field
      "password":"YOUR PASSWORD",                     //Optional field
      "profile_picture": "YOUR IMAGE URL",             //Optional field
      "phone":YOUR 10 DIGIT PHONE NUMBER               //Optional Field

    }

  4) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/user/signout
     (POST REQUEST FOR SIGNING OUT CURRENT USER)   //NO req.body REQUIRED
  
    
  COURSES ROUTES

1)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses          (Optional Query Strings searchTerm,category,level,popularity)
    (GET REQUEST FOR SEARCHING COURSES)
    
    Currently The Database contains Courses related to Web Development,App Development,Cyber Security,Blockchain,Artificial Intelligence,Machine Learning,Data Science,Python,C/C++
    So for applying filters any of the filters such as the searchTerm,category,level,popularity may be used

    //Example for searching a course through a searchTerm
    https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses?searchTerm=WebDevelopment       //Avoid giving spaces in the query for it to work

    //Example for searching a course through a category
    https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses?category=Web-Development        //Category can be ["Web-Development","App-Development","Cyber-Security","Blockchain","Artificial-Intelligence","Machine-Learning","Data-Science","Python","C/C++"]

    //Example for filtering courses through Level of Difficulty
    https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses?level=Easy                      //Category can be ["Easy","Intermediate","Hard"]

    //Example for filtering courses through the popularity
    https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses?popularity=1                  //Sorts all the results in decreasing order of their popularity

    //You can also use multiple filters at once 
    https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses?searchTerm=Web&level=Easy&popularity=1;    //Retrieves all results related to Web development of Easy difficulty sorted from most popular to least popular

2) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses/:id                //Replace :id by an id for a course
   (GET REQUEST TO RETRIEVE COURSE DETAILS OF A SPECIFIC COURSE)

3) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses/create
   (POST REQUEST TO CREATE A NEW COURSE EXCLUSIVE FOR ADMIN ONLY !!!)

   The JSON in the req.body shall have the following format.

   {
       "title":"YOUR COURSE TITLE",
       "description":"COURSE DESCRIPTION",
       "category":"COURSE CATEGORY"
       "level":"COURSE DIFFICULTY",      ["Easy","Intermediate","Hard"]
       "popularity": A NUMBER (0-100)
    }

4) https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses/update/:id          //Replace :id by an id for a course
   (PUT REQUEST TO UPDATE A COURSE EXCLUSIVE FOR ADMIN ONLY !!!)

   The JSON in the req.body shall have the following format.

   {
       "title":"YOUR COURSE TITLE",                    //OPTIONAL
       "description":"COURSE DESCRIPTION",             //OPTIONAL
       "category":"COURSE CATEGORY"                    //OPTIONAL
       "level":"COURSE DIFFICULTY",      ["Easy","Intermediate","Hard"]        //OPTIONAL
       "popularity": A NUMBER (0-100)                  //OPTIONAL
    }

   5)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/courses/update/:id          //Replace :id by an id for a course
      (DELETE REQUEST TO DELETE A COURSE EXCLUSIVE FOR ADMIN ONLY !!!)

  ENROLLMENT ROUTES

1)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/enrollments
    (POST REQUEST USING WHICH A SIGNED IN USER CAN ENROLL INTO ANY AVAILABLE COURSE)

    The Json body should be as follows:

    {
      "courseId":Course Id you want to enroll in(Numeric value)
    }

2)  https://aeonaxy-nodejs-41m4.onrender.com/api/v1/enrollments/enrolled_courses
    (GET REQUEST TO RETRIEVE ALL THE COURSES THE USER IS ENROLLED IN)

    
    
    
    
   
