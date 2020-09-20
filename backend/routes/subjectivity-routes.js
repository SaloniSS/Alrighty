const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res, next) => {
  const textToAnalyze = req.query.text;
  //console.log(req.query.text);
  const URI = `https://us-central1-saloni-shivdasani.cloudfunctions.net/subjectivity-analyzer?text=${textToAnalyze}`;
  const encodedURI = encodeURI(URI);
  const response = await axios.get(encodedURI);
  //console.log(response.data);
  return res.status(200).json(response.data);
});

module.exports = router;
