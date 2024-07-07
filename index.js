import express from "express";
import bcrypt from "bcrypt";
import {UserModel} from "./models/user-model.js";
import { dbConnection } from "./src/config.js";


const app = express();

app.set('view engine', 'ejs');

dbConnection();

app.use(express.json());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
    res.render('home')
});

app.get("/login", (_req, res) => {
    res.render("login")
});

app.get("/signup", (_req, res) => {
    res.render("signup")
});



app.post("/signup", async (req, res) => {

    const data = {
      username: req.body.username,
      password: req.body.password
    }
  
    // Check if the username already exists in the database
    const existingUser = await UserModel.findOne({ username: data.username });
  
    if (existingUser) {
      res.send('User already exists.');
    } else {
      // Hash the password using bcrypt
      const saltRounds = 10; // Number of salt rounds for bcrypt
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
      data.password = hashedPassword; // Replace the original password with the hashed one
  
      try {
        const newUser = await UserModel.insertMany(data); // Use create for single document
        console.log(newUser);
        res.send("User created successfully!"); // Or redirect to a success page
      } catch (error) {
        console.error(error);
        res.send("Error creating user."); // Handle errors more specifically if needed
      }
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
        res.send("Login failed"); // Or a more generic message
      } else {
        console.error("Unexpected error during login:", error);
        res.status(500).send("Internal Server Error"); // Indicate server error
      }
    }
  });

  

const port = 8080;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

