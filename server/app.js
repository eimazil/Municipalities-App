const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: "10mb" }));
const cors = require("cors");
app.use(cors());
const md5 = require("js-md5");
const uuid = require("uuid");
const mysql = require("mysql");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "municipalities_database",
});

////////////////////LOGIN/////////////////

const doAuth = function (req, res, next) {
  if (0 === req.url.indexOf("/server")) {
    // admin
    const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
    con.query(sql, [req.headers["authorization"] || ""], (err, results) => {
      if (err) throw err;
      if (!results.length || results[0].role !== 10) {
        res.status(401).send({});
        req.connection.destroy();
      } else {
        next();
      }
    });
  } else if (
    0 === req.url.indexOf("/login-check") ||
    0 === req.url.indexOf("/login") ||
    0 === req.url.indexOf("/register") ||
    0 === req.url.indexOf("/")
  ) {
    next();
  } else {
    // fron
    const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
    con.query(sql, [req.headers["authorization"] || ""], (err, results) => {
      if (err) throw err;
      if (!results.length) {
        res.status(401).send({});
        req.connection.destroy();
      } else {
        next();
      }
    });
  }
};

app.use(doAuth);

// AUTH
app.get("/login-check", (req, res) => {
  const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
  con.query(sql, [req.headers["authorization"] || ""], (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.send({ msg: "error", status: 1 }); // user not logged
    } else {
      if ("admin" === req.query.role) {
        if (result[0].role !== 10) {
          res.send({ msg: "error", status: 2 }); // not an admin
        } else {
          res.send({ msg: "ok", status: 3 }); // is admin
        }
      } else {
        res.send({ msg: "ok", status: 4 }); // is user
      }
    }
  });
});

app.post("/login", (req, res) => {
  const key = uuid.v4();
  const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
  con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
    if (err) throw err;
    if (!result.affectedRows) {
      res.send({ msg: "error", key: "" });
    } else {
      res.send({ msg: "ok", key });
    }
  });
});

app.get("/login/:session", (req, res) => {
  const sql = `
         SELECT id
         FROM users
         WHERE session = ?
    `;
  con.query(sql, [req.params.session], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/register", (req, res) => {
  const sql = `
    INSERT INTO users (name, psw)
    VALUES (?, ?)
  `;
  con.query(sql, [req.body.name, md5(req.body.pass)], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

///////////////////END////////////////////

// Municipalities CRUD
// CREATE
app.post("/admin/municipalities", (req, res) => {
  const sql = `
    INSERT INTO municipalities (title, image)
    VALUES (?, ?)
    `;
  con.query(sql, [req.body.title, req.body.image], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// READ
app.get("/admin/municipalities", (req, res) => {
  const sql = `
    SELECT *
    FROM municipalities
    ORDER BY id DESC
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// EDIT
app.put("/admin/municipalities/:id", (req, res) => {
  let sql;
  let r;
  if (req.body.deletePhoto) {
    sql = `
        UPDATE municipalities
        SET title = ?, image = null
        WHERE id = ?
        `;
    r = [req.body.title, req.params.id];
  } else if (req.body.image) {
    sql = `
        UPDATE municipalities
        SET title = ?, image = ?
        WHERE id = ?
        `;
    r = [req.body.title, req.body.image, req.params.id];
  } else {
    sql = `
        UPDATE municipalities
        SET title = ?
        WHERE id = ?
        `;
    r = [req.body.title, req.params.id];
  }
  con.query(sql, r, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete
app.delete("/admin/municipalities/:id", (req, res) => {
  const sql = `
    DELETE FROM municipalities
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Scopes CRUD
// CREATE
app.post("/admin/scopes", (req, res) => {
  const sql = `
    INSERT INTO scopes (title)
    VALUES (?)
    `;
  con.query(sql, [req.body.title, req.body.image], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// READ
app.get("/admin/scopes", (req, res) => {
  const sql = `
    SELECT *
    FROM scopes
    ORDER BY id DESC
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// EDIT
app.put("/admin/scopes/:id", (req, res) => {
  const sql = `
    UPDATE scopes
    SET title = ?
    WHERE id = ?
    `;
  con.query(sql, [req.body.title, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete
app.delete("/admin/scopes/:id", (req, res) => {
  const sql = `
    DELETE FROM scopes
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Admin home

app.get("/home/municipalities", (req, res) => {
  const sql = `
    SELECT *
    FROM municipalities
    ORDER BY id
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/home/scopes", (req, res) => {
  const sql = `
    SELECT *
    FROM scopes
    ORDER BY id DESC
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/home/suggestions", (req, res) => {
  const sql = `
    INSERT INTO comments (post, municipality_id, scope_id )
    VALUES (?, ?, ?)
    `;
  con.query(
    sql,
    [req.body.post, req.body.municipality_id, req.body.scope_id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/home/suggestions", (req, res) => {
  const sql = `
    SELECT s.*, m.title, m.image, sc.title as name
    FROM comments AS s
    INNER JOIN municipalities AS m
    ON s.municipality_id = m.id
    INNER JOIN scopes as sc
    ON s.scope_id = sc.id
    ORDER BY s.id
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// ADMIN SUGGESTIONS

app.get("/admin/suggestions", (req, res) => {
  const sql = `
    SELECT s.*, m.title, m.image, sc.title as name
    FROM comments AS s
    INNER JOIN municipalities AS m
    ON s.municipality_id = m.id
    INNER JOIN scopes as sc
    ON s.scope_id = sc.id
    ORDER BY s.id
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put("/admin/suggestions/:id", (req, res) => {
  const sql = `
    UPDATE comments
    SET state = ?
    WHERE id = ?
    `;
  con.query(sql, [req.body.state, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/admin/suggestions/:id", (req, res) => {
  const sql = `
    DELETE FROM comments
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Rūbų parduotuvė dirba per ${port} portą!`);
});
