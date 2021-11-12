var express = require("express");
var router = express.Router();
var request = require("request");

router.get("/", function (req, res) {
  request.get(
    "https://api.themoviedb.org/3/movie/550?api_key=f4d1d17891e8453813a96c0f751cf2b2",
    function (err, response, body) {
      if (!err && response.statusCode == 200) {
        var locals = JSON.parse(body);
        console.log(locals);
        res.json(locals);
      }
    }
  );
});

router.post("/", function (req, res) {
  res.json({ yep: "WOOWWWW" });
});

module.exports = router;
