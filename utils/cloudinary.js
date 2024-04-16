const cloudinary=require('cloudinary').v2;


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
});

const uploadImage=async(imageLink)=>{
    cloudinary.uploader.upload(imageLink,{
        folder:'aeonaxy backend'
    }).then(result=>{
        console.log('Image uploaded successfully');
    })
    .catch(err => {
        console.error(`Failed to upload image ${imageLink}`, err);
    });

}

module.exports=uploadImage;