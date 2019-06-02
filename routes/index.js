const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.send(`Welcome to Virtual Classroom`)
});


let admin = require("./routes/admin");

router.route("/api/admin/login").post(admin.login);

router.route("/api/admin/register").post(admin.register);

router.route("/api/admin/new").post(admin.new);

router.route("/api/admin/students/:matric?").get(admin.getAllStudents);

router.route("/api/admin/lecturers/:staff_no?").get(admin.getAllLecturers);

module.exports = router;