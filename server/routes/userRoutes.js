const { register, login, setAvatar, getAllUsers} = require('../controllers/userControllers');
const verifyToken = require('../middleware/verifyToken'); 

const router = require('express').Router();
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers", verifyToken, getAllUsers);

module.exports = router;