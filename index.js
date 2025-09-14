import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];
let filter = "-1";
const tags = ["Tech", "Lifestyle", "Education", "Other"];

// render home page
app.get("/", (req, res) => {
  render(res, "none", null);
});

// open create new post popup
app.post("/newPost", (req, res) => {
  render(res, "create", null);
});

// add new post and its content, redirect to home
app.post("/addPost", (req, res) => {
  if (req.body.submit !== "Cancel") {
    newPost(req.body.user, req.body.title, req.body.body, req.body.tag);
  }
  res.redirect("/");
});

// open edit post popup
app.post("/edit", (req, res) => {
  const postID = Object.keys(req.body)[0];
  render(res, "edit", postID);
});

// change the filter and redirect to home
app.post("/filter", (req, res) => {
  filter = req.body.tag;
  res.redirect("/");
});

// apply changes from editing then redirect to home
app.post("/changePost", (req, res) => {
  const postID = Object.keys(req.body).filter((key) => !isNaN(Number(key)))[0];
  const post = posts.filter((post) => post.id === Number(postID))[0];
  if (post) {
    post.date = `edited: ${newDateString(Date.now())}`;
    post.userName = req.body.user;
    post.title = req.body.title;
    post.body = req.body.body;
    post.tag = req.body.tag;
  }
  res.redirect("/");
});

// delete post and redirect to home
app.post("/delete", (req, res) => {
  const postID = Object.keys(req.body)[0];
  posts = posts.filter((post) => post.id !== Number(postID));
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

// create a new post object and add it to the posts array
function newPost(user, title, body, tag) {
  const postID = Date.now();
  const postObj = {
    id: Number(postID),
    userName: user && user.length > 0 ? user : "no-user",
    date: newDateString(postID),
    title: title && title.length > 0 ? title : "no title",
    body: body && body.length > 0 ? body : "no content",
    tag: tag,
  };
  posts.push(postObj);
}

// create a formated date string
function newDateString(date) {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString()}`;
}

// render the index file with the expected variables
function render(res, status, postID) {
  res.render("index.ejs", {
    posts: posts
      .filter((post) => (filter === "-1" ? true : post.tag === filter))
      .reverse(),
    status: status,
    postID: postID,
    tags: tags,
    filter: filter,
  });
}
