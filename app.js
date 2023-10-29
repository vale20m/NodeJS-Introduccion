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

// app.get("/people", (req, res) => {
//   res.json(people); // Enviamos todo el array
// });

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

app.get("/people/:index", (req, res) => {
  /*La propiedad "params" del request permite acceder a los parámetros de la URL 
    (importante no confundir con la "query", que serían los parámetros que se colocan 
    luego del signo "?" en la URL)
   */
  res.json(people[req.params.index]); // Enviamos el elemento solicitado por su índice
});

// app.post("/people", (req, res) => {
//   /* La propiedad "body" del request permite acceder a los datos 
//        que se encuentran en el cuerpo de la petición */

//   people.push(req.body); // Añadimos un nuevo elemento al array

//   res.json(req.body); // Le respondemos al cliente el objeto añadido
// });

// Intento realizar la funcion post con nodeJS

app.post("/people", async (req, res) => {
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


app.put("/people/:index", (req, res) => {
  /* COMPLETA EL CÓDIGO NECESARIO:
     Para que se pueda actualizar el objeto asociado al índice indicado en la URL 
   */
  
  people.splice(req.params.index, 1, req.body); // Reemplazamos un elemento del array por uno que introduzca el cliente

  res.json(req.body); // Le respondemos al cliente el nuevo objeto
});

app.delete("/people/:index", (req, res) => {
  /* COMPLETA EL CÓDIGO NECESARIO:
     Para que se pueda eliminar el objeto asociado al índice indicado en la URL 
   */

  res.json(people[req.params.index]); // Le respondemos al cliente el elemento que se va a eliminar

  people.splice(req.params.index, 1); // Eliminamos el elemento del array
});

// Esta línea inicia el servidor para que escuche peticiones en el puerto indicado
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
