import express from "express";
import bcrypt from "bcrypt";
import {UserModel} from "./models/user-model.js";
import { dbConnection } from "./src/config.js";


const app = express();

app.set('view engine', 'ejs');

dbConnection();

app.use(express.json());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render('home')
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/signup", (req, res) => {
    res.render("signup")
});


 
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.send('User already exists.');
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const newUser = new UserModel({
      username,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    console.log('User created successfully:', newUser);
    res.send("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user."); 
  }
});


app.post("/login", async (req, res) => {
    try {
      const check = await UserModel.findOne({ username: req.body.username });
      if (!check) {
        res.send("User not found");
      } else {
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
          res.send("Wrong Username/Password");
        } else {
          res.render("home");
        }
      }
    } catch (error) {
      if (error instanceof bcrypt.BcryptError) {
        console.error("Error comparing passwords:", error);
        res.send("Login failed"); 
      } else {
        console.error("Unexpected error during login:", error);
        res.status(500).send("Internal Server Error"); 
      }
    }
  });

  

const port = 8080;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

