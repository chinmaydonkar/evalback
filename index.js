const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model");
const { todosRouter } = require("./routes/todos.route");
const { authenticate } = require("./middlewares/auth");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (request, response) => {
  response.send("Welcome to todo!");
});

//signup
app.post("/signup", async (request, response) => {
  console.log(request.body);
  const { email, password } = request.body;
  const userPresent = await UserModel.findOne({ email });

  if (userPresent?.email) {
    response.send("Try loggin in, user already exists");
  } else {
    try {
      bcrypt.hash(password, 4, async function (err, hash) {
        const user = new UserModel({ email, password: hash });
        await user.save();
        response.send("Signup successfully!");
      });
    } catch (err) {
      console.log(err);
      response.send("Something was wrong, please try again ");
    }
  }
});

//login
app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      const hashed_password = user[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          const token = jwt.sign(
            {
              userId: user[0]._id,
            },
            "hush"
          );
          response.send({
            msg: "Login successfull",
            token: token,
          });
        } else {
          response.send("Login Failed!");
        }
      });
    } else {
      response.send("Login Failed!");
    }
  } catch {
    response.send("Something went wrong,pls try again");
  }
});

app.get("/todos", (request, response) => {
  response.send("Todos");
});

app.use(authenticate);

app.use("/todos", todosRouter);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.log(err);
    console.log("failed to connect db");
  }
  console.log("Listening on 8080");
});
