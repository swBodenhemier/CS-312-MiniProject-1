import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

let posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts.slice().reverse(), status: "none" });
});

app.post("/newPost", (req, res) => {
  res.render("index.ejs", { posts: posts.slice().reverse(), status: "create" });
});

app.post("/addPost", (req, res) => {
  if (req.body.submit !== "Cancel") {
    newPost(req.body.user, req.body.title, req.body.body);
  }
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const postID = Object.keys(req.body)[0];
  res.render("index.ejs", {
    posts: posts.slice().reverse(),
    status: "edit",
    postID: postID,
  });
});

app.post("/changePost", (req, res) => {
  const postID = Object.keys(req.body).filter((key) => !isNaN(Number(key)))[0];
  const post = posts.filter((post) => post.id === Number(postID))[0];
  if (post) {
    post.date = `edited: ${newDateString(post.id)}`;
    post.userName = req.body.user;
    post.title = req.body.title;
    post.body = req.body.body;
  }
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const postID = Object.keys(req.body)[0];
  posts = posts.filter((post) => post.id !== Number(postID));
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

function newPost(user, title, body) {
  const postID = Date.now();
  const postObj = {
    id: Number(postID),
    userName: user && user.length > 0 ? user : "no-user",
    date: newDateString(postID),
    title: title && title.length > 0 ? title : "no title",
    body: body && body.length > 0 ? body : "no content",
  };
  posts.push(postObj);
}

function newDateString(date) {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString()}`;
}
