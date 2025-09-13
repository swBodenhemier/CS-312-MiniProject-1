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

const posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts, editing: false });
});

app.post("/newPost", (req, res) => {
  console.log(req.body);
  res.render("index.ejs", { posts: posts, editing: true });
});

app.post("/addPost", (req, res) => {
  console.log(req.body);
  newPost(req.body.user, req.body.title, req.body.body);
  res.render("index.ejs", { posts: posts, editing: false });
  // res.render("file", {key: variable})
  /* ejs tags:
  <%= variable %>
  <% executable js code %>
  <%- HTML %>
  <%% show ejs tag %%>
  <%# comment %>
  <%- include(another ejs file) %>
    ----------
  if(locals.variable) check for undefined
  */
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

function newPost(user, title, body) {
  const postID = Date.now();
  const date = new Date(postID);
  const postObj = {
    id: postID,
    userName: user && user.length > 0 ? user : "no-user",
    date: date.toDateString(),
    title: title && title.length > 0 ? title : "no-title",
    body: body && body.length > 0 ? body : "no-body",
  };
  posts.push(postObj);
}
