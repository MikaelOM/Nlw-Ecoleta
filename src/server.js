const express = require("express");
const server = express();
const db = require("./database/db");

//conf pasta public
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

//Utilizando o Nunjucks
const Nunjucks = require("nunjucks");

Nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

//confg caminho
//Pagina inicial
server.get("/", (req, res) => {
  return res.render("index.html");
});

server.get("/create-point", (req, res) => {
  console.log(req.query);
  return res.render("create-point.html");
});
server.post("/savepoint", (req, res) => {
  const query = `
 INSERT INTO places(
  image,
 name,
  address,
  address2,
  state,
  city,
   items
  ) VALUES(?,?,?,?,?,?,?);
`;
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];
  function afterInsertData(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no cadastro");
    }

    console.log("Cadastrado com sucesso");
    console.log(this);
    return res.render("create-point.html", { saved: true });
  }

  db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {
  const search = req.query.search;
  if (search == "") {
    return res.render("search-results.html", { total: 0 });
  }

  db.all(` SELECT * FROM places WHERE city  like '%${search}%'`, function (
    err,
    rows
  ) {
    if (err) {
      return console.log(err);
    }
    const total = rows.length;
    return res.render("search-result.html", { places: rows, total });
  });
});
//ligar o servidor
server.listen(3030);
