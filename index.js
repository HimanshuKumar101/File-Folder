//APP CREATE
const express = require("express");
const app = express();

//port find karna ha 
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//middleware add karnss hs 
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));



//db SE CONNECT karnah 
const db = require("./config/database");
db.connect();

////cloud se connect karna ha 
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();


//api route mount karna ha 
const uploadRoutes = require("./routes/FileUpload");
app.use('/api/v1/upload', uploadRoutes);



//activate karna ha server
app.listen(PORT, () => {
    console.log(`App is running at  ${PORT}`);
}) 