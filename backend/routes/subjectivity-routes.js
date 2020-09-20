const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res, next) => {
  const textToAnalyze = req.query.text;
  //console.log(req.query.text);
  const response = await axios.get(
    `https://us-central1-saloni-shivdasani.cloudfunctions.net/subjectivity-analyzer?text=${textToAnalyze}`
  );
  //console.log(response);
  return res.status(200).json(response.data);
});

module.exports = router;
