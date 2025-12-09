const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getMyProfile,
  getAllUsers,
  getPublicProfile
} = require("../controllers/profilController");

const upload = require("../middleware/upload");
const { requireLogin } = require("../middleware/auth");



router.get("/me", requireLogin, getMyProfile);
router.get("/all", requireLogin, getAllUsers);
router.get("/:id", getPublicProfile);
router.put("/update/:id", requireLogin, upload.single("photo"), updateProfile);

module.exports = router;

 


//const express = require("express");
//const router = express.Router();

//router.get("/me", (req, res) => {
  //res.json({ test: "ok" });
//});

//module.exports = router;

