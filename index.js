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

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  console.log(req.body);
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
