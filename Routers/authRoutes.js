import express from "express";
import authcontroller from '../controllers/authcontroller.js'
import protect from "../Middleware/authMiddleware.js";
import Upload from "../Middleware/uploadMiddleware.js";
const router = express.Router()




//Auth Routes//

router.post("/register", authcontroller.registerUser)
router.post("/login", authcontroller.loginUser)
router.get("/profile", protect, authcontroller.getUserProfile)

router.post('/upload-image', Upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(404).json({ message: "NO file uplaoded" })
    }
    const ImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ ImageUrl })
})
export default router 