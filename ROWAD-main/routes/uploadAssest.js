const express = require("express");
const {GenerateLogo} = require("../controllers/UploadAssests");

const router = express.Router();

router.route("/upload").post(GenerateLogo);


module.exports = router;
