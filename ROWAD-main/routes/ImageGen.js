const express = require("express");
const {GenerateLogo} = require("../controllers/ImageGen");

const router = express.Router();

router.route("/generateImage").post(GenerateLogo);


module.exports = router;