const { cloudinaryConnect } = require("../config/cloudinary");
const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
const { localFileUpload, imageUpload } = require("../controllers/fileUpload");

//localFileUpload -> handler function

exports.localFileUpload = async (req, res) => {
  try {
    //fetch filefrom request
    const file = req.files.file;
    console.log("FILE AAGYI OHH -> ", file);

    //create path where file need to be stored on server
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("PATH ->", path);

    //add path to the move functioon
    file.mv(path, (err) => {
      console.log(err);
    });

    //create a successful response
    res.json({
      success: true,
      message: "Local file uploaded Successfully",
    });
  } catch (error) {
    console.log("Not able to upload the file on server");
    console.log(error);
  }
};

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
 console.log("temp file path", file.tempFilePath);

 if(quality){
    options.quality = quality;
 }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//image upload ka handler
exports.imageUpload = async (req, res) => {
  console.log("imageUpload route hit");
  try {
    const { name, tags, email } = req.body;
    const file = req.files.imageFile;

    console.log(name, tags, email);
    console.log(file);

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".").pop().toLowerCase();
    console.log("File Type:", fileType);

    if (!supportedTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    console.log("uploading to Cloudinary");
    const response = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Codehelp",
    });

    console.log(response); // Check the response from Cloudinary

    //db me entry save karni ha
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      message: "Image Successfully Uploaded",
      imageUrl: response.secure_url, // Include the URL in the response if needed
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//video upload ka handler

exports.videoUpload = async (req, res) => {
  try {
    //data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.videoFile;

    //validation
    const supportedTypes = ["mp4", "mov "];
    const fileType = file.name.split(".").pop().toLowerCase();
    console.log("File Type:", fileType);

    // ToDo: add a upper limit of 5MB for video
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    //file format supported hai
    console.log("Uploading to Codehelp");
    const response = await uploadFileToCloudinary(file, "Codehelp");
    console.log(response);

    //db me entry save karli
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Video SuccessFully Uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



//imageSize Reducer
exports.imageSizeReducer = async (req, res) => {
    try{

        //data fetch
        const {name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);


        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);


        if(!isFileTypeSupported(fileType, supportedTypes)){

           return res.status(400).json({
            success:false,
            messsage:'File format Not Supported',
           })
        }


        //file format supported hai
        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file, "Codehelp", 90);
        console.log(response);


        //db me entry save karni ha
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image SuccessFully Uploaded',
        })

    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}