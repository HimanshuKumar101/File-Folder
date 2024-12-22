const express = require("express");
const router = express.Router();

const { localFileUpload, imageUpload, videoUpload , imageSizeReducer} = require("../controllers/fileUpload");

// Define the routes
router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);  // This is the route you're trying to hit
router.post("/videoUpload", videoUpload);
router.post("/imageSizeReducer", imageSizeReducer);

module.exports = router;
