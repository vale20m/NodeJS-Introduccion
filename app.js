const express = require("express"); // Importa ExpressJS. Más info de Express en =>https://expressjs.com/es/starter/hello-world.html

const mariadb = require('mariadb'); // Importamos la libreria "MariaDB"

// Permite crear las conexiones a la base de datos
const pool = mariadb.createPool({host: "localhost", user: "root", password:"1234", database:"pruebadb", connectionLimit: 5});

const app = express(); // Crea una instancia de ExpressJS

const port = 3000;

app.use(express.json()); // Permite que el servidor analice el cuerpo de las peticiones como JSON

const people = require("./json/people.json"); // Importa los datos iniciales (generados en https://www.mockaroo.com/)

app.get("/", (req, res) => {
  // El primer parámetro SIEMPRE es asociado a la request (petición) y el segundo a la response (respuesta)
  res.send("<h1>Bienvenid@ al servidor</h1>");
});


// Utilizacion de la base de datos desde nodeJS

app.get("/people", async (req, res) => {
  let conn;
  try {

  // Realiza el select de la database
  conn = await pool.getConnection();
  const rows = await conn.query("SELECT name, lastname, email FROM people");

  // Linea que contesta al cliente
  res.json(rows);

  }catch(error){
    res.status(500).json({message:"Se rompió el servidor"});
  } finally {
  if (conn) conn.release(); //release to pool
  }
});

// Realizamos un GET segun la id del elemento

app.get("/people/:id", async (req, res) => {
  let conn;
  try {

  // Realiza el select de la database
  conn = await pool.getConnection();
  const rows = await conn.query("SELECT name, lastname, email FROM people WHERE id=?",[req.params.id]);

  // Linea que contesta al cliente
  res.json(rows[0]);

  }catch(error){
    res.status(500).json({message:"Se rompió el servidor"});
  } finally {
  if (conn) conn.release(); //release to pool
  }
});


// Realizamos la funcion POST con nodeJS

app.post("/people", async (req, res) => {
  let conn;
  try {

  // Insertamos un elemento con nombre, apellido y email especificados en el body

  conn = await pool.getConnection();
  const response = await conn.query(`INSERT INTO people (name, lastname, email)
  VALUES (?, ?, ?)`, [req.body.name, req.body.lastname, req.body.email]);

  // Linea que contesta al cliente
  res.json({ id: response.insertID, ...req.body});

  }catch(error){
    console.log(error);
    res.status(500).json({message:"Se rompió el servidor"});
  } finally {
  if (conn) conn.release(); //release to pool
  }
});

// Realizamos la funcion PUT con nodeJS (segun su ID)

app.put("/people/:id", async (req, res) => {
  let conn;
  try {

  // Actualizamos el elemento cuya id se especifica en la URL

  conn = await pool.getConnection();
  const response = await conn.query(`UPDATE people SET name=?, lastname=?, email=?
  WHERE id=?`, [req.body.name, req.body.lastname, req.body.email, req.params.id]);

  // Linea que contesta al cliente
  res.json({ id: response.insertID, ...req.body});

  }catch(error){
    console.log(error);
    res.status(500).json({message:"Se rompió el servidor"});
  } finally {
  if (conn) conn.release(); //release to pool
  }
});

// Realizamos la funcion DELETE con nodeJS (segun su ID)

app.delete("/people/:id", async(req, res) => {
  let conn;
  try {

  conn = await pool.getConnection();

  // Realizamos un SELECT para devolver el elemento que se va a eliminar

  const rows = await conn.query("SELECT name, lastname, email FROM people WHERE id=?",[req.params.id]);

  // Linea que contesta al cliente
  res.json(rows[0]);

  const response = await conn.query(`DELETE FROM people WHERE id=?`, [req.params.id]);

  }catch(error){
    console.log(error);
    res.status(500).json({message:"Se rompió el servidor"});
  } finally {
  if (conn) conn.release(); //release to pool
  }
});

// Esta línea inicia el servidor para que escuche peticiones en el puerto indicado
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
