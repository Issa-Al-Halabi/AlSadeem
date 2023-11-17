const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "assets")));
app.set("view engine", "ejs");

const MyMongoDBURL = "mongodb+srv://em:qwerqwer@cluster0.vb0somt.mongodb.net/?retryWrites=true&w=majority";

// Define a schema for a collection
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create a model for the collection
const User = mongoose.model("User", userSchema);

// All GET Routes
app.get("/", async (req, res) => {
  const userData = req.cookies.userData;

  if (!userData) {
    res.redirect("/login");
  }
  res.render("welcome", userData);
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.get("/signup", async (req, res) => {
  res.render("signup");
});

app.get("/logout", async (req, res) => {
  res.clearCookie("userData");
  res.redirect("/login");
});

// All POST Routes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Connect to MongoDB
  mongoose
    .connect(
      MyMongoDBURL
    )
    .then(async () => {
      console.log("Connected to MongoDB");
      // Check if the user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("login", {
          errorMessage: "لم يتم ايجاد مستخدم ",
        });
      }
      // Check if the password is correct
      if (user.password !== password) {
        return res.render("login", {
          errorMessage: "كلمة مرور خاطئة",
        });
      }

      // If everything is correct, log the user in
      mongoose.disconnect();
      res.cookie("userData", {
        username: user.username,
        email: user.email,
        password: user.password,
      });
      return res.redirect("/");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
      mongoose.disconnect();
      return res.redirect("/login");
    });
});


app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  mongoose
    .connect(
      MyMongoDBURL
    ).then(async () => {
      console.log("Connected to MongoDB");

      let userData = {
        username,
        email,
        password
      }

      let newUser = new User(userData);
      await newUser.save();
      console.log("SAVED");

      // If everything is correct, log the user in
      mongoose.disconnect();
      res.cookie("userData", userData);
      return res.redirect("/");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
      mongoose.disconnect();
      return res.render("signup", {
        errorMessage: "حدث خطأ ما",
      });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
