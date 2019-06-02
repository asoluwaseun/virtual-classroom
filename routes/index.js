const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
<form method="post" action="/api/admin/new" enctype="multipart/form-data">
  Name  <input type="text" name="name"></br>
  Email <input type="text" name="email"><br>
  Department <input type="text" name="department"><br>
  Level <input type="text" name="level"><br>
  Picture <input type="file" name="picture"><br>
  Role <input type="text" name="role">
  <input type="submit" value="submit">
</form>`)
});


let admin = require("./routes/admin");

router.route("/api/admin/login").post(admin.login);

router.route("/api/admin/register").post(admin.register);

router.route("/api/admin/new").post(admin.new);

router.route("/api/admin/students/:matric?").get(admin.getAllStudents);

router.route("/api/admin/lecturers/:staff_no?").get(admin.getAllLecturers);

module.exports = router;