//modulo npm i express
//npm install express-basic-auth
//npm install express body-parser
//npm i swagger-ui-express
//npm i swagger-jsdoc
//npm i swagger-themes
//npm i dotenv
//jest
// "start": "node --env-file .env index.js",
//supertest
//npm i morgan
//npm i mysql
//npm i mysql2
//redoc express, al instalar te va generar otro tipo de documentacion
//Investigacion de los principios de Api rest son como 5 o 6 una definicion de cada uno interfaz uniforme en un documento MD
//Restricciones de la arquitectura RES
const { SwaggerTheme } = require('swagger-themes');
const express=require('express');
const morgan = require('morgan');
const fs=require('fs');
const path=require('path');
const mysql =require('mysql2/promise');
const app=express();
var cors=require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
//npm install redoc-express
const redoc = require('redoc-express');

const PORT = process.env.MYSQLPORT || 8084;
const HOST = process.env.MYSQLHOST;
const USER = process.env.MYSQLUSER;
const PASSWORD = process.env.MYSQLPASSWORD;
const DATABASE = process.env.MYSQL_DATABASE;

var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
app.use(morgan('combined',{stream:accessLogStream}));
app.use(express.json());
app.use(cors());
const theme = new SwaggerTheme('v3');

const options = {
   explorer: true,
   customCss: theme.getBuffer('monokai')
 };


/**
 * @swagger
 * /platillos:
 *   get:
 *     tags:
 *       - platillo
 *     summary: Consultar todos los platillos
 *     description: Obtener información de todos los platillos
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Información de todos los platillos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nombre: "Tacos al Pastor"
 *                 tipo_comida: "Tacos"
 *                 ingredientes: "Cerdo marinado, piña, cebolla, cilantro"
 *                 region: "Ciudad de México"
 *                 nivel_picante: "Moderado"
 *                 tipo_carne: "Cerdo"
 *                 acompanamientos: "Cebolla y cilantro picado"
 *                 metodo_preparacion: "Asado y servido en tortillas de maíz"
 *                 historia_contexto: "Platillo tradicional mexicano"
 *                 calorias: 400
 *                 popularidad: 5
 *               - id: 2
 *                 nombre: "Guacamole"
 *                 tipo_comida: "Aperitivo"
 *                 ingredientes: "Aguacate, tomate, cebolla, cilantro, limón"
 *                 region: "Varias"
 *                 nivel_picante: "Suave"
 *                 tipo_carne: "Vegetariano"
 *                 acompanamientos: "Tortillas de maíz"
 *                 metodo_preparacion: "Mezclar todos los ingredientes en un tazón"
 *                 historia_contexto: "Acompañamiento fresco y saludable"
 *                 calorias: 150
 *                 popularidad: 4
 *               # ... agregar más platillos según sea necesario
 *       500:
 *         description: Error en el servidor
 */
app.get("/platillos", async (req, res) => {
   try {
       const conn = await mysql.createConnection({
           host: HOST,
           user: USER,
           password: PASSWORD,
           database: DATABASE
       });
       const [rows, fields] = await conn.query('SELECT * FROM Platillo');
       res.json(rows);
   } catch (err) {
       res.status(500).json({ mensaje: err.sqlMessage });
   }
});

/**
 * @swagger
 * /platillos/{id}:
 *   get:
 *     tags:
 *       - platillo
 *     summary: Consultar platillo por ID
 *     description: Obtener información de un platillo específico
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del platillo
 *     responses:
 *       200:
 *         description: Información del platillo
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nombre: "Tacos al Pastor"
 *               tipo_comida: "Tacos"
 *               ingredientes: "Cerdo marinado, piña, cebolla, cilantro"
 *               region: "Ciudad de México"
 *               nivel_picante: "Moderado"
 *               tipo_carne: "Cerdo"
 *               acompanamientos: "Cebolla y cilantro picado"
 *               metodo_preparacion: "Asado y servido en tortillas de maíz"
 *               historia_contexto: "Platillo tradicional mexicano"
 *               calorias: 400
 *               popularidad: 5
 *       404:
 *         description: Platillo no encontrado
 *       500:
 *         description: Error en el servidor
 */
app.get("/platillos/:id", async (req, res) => {
    try {
        const conn = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        const [rows, fields] = await conn.query('SELECT * FROM Platillo WHERE id = ?', [req.params.id]);

        if (rows.length > 0) {
            res.json(rows[0]); // Devolver el primer resultado (debería ser único ya que es por ID)
        } else {
            res.status(404).json({ mensaje: 'Platillo no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ mensaje: err.sqlMessage });
    }
});

/**
 * @swagger
 * /platillos:
 *   post:
 *     tags:
 *       - platillo
 *     summary: Agregar un nuevo platillo
 *     description: Dar de alta un nuevo platillo en la base de datos
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: platillo
 *         description: Información del nuevo platillo
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             tipo_comida:
 *               type: string
 *             ingredientes:
 *               type: string
 *             region:
 *               type: string
 *             nivel_picante:
 *               type: string
 *             tipo_carne:
 *               type: string
 *             acompanamientos:
 *               type: string
 *             metodo_preparacion:
 *               type: string
 *             historia_contexto:
 *               type: string
 *             calorias:
 *               type: integer
 *             popularidad:
 *               type: integer
 *     responses:
 *       201:
 *         description: Platillo creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
app.post("/platillos", async (req, res) => {
   try {
    const conn = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE
    });

       const {
           nombre,
           tipo_comida,
           ingredientes,
           region,
           nivel_picante,
           tipo_carne,
           acompanamientos,
           metodo_preparacion,
           historia_contexto,
           calorias,
           popularidad
       } = req.body;

       await conn.query('INSERT INTO Platillo (nombre, tipo_comida, ingredientes, region, nivel_picante, tipo_carne, acompanamientos, metodo_preparacion, historia_contexto, calorias, popularidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
           [nombre, tipo_comida, ingredientes, region, nivel_picante, tipo_carne, acompanamientos, metodo_preparacion, historia_contexto, calorias, popularidad]);

       res.status(201).json({ mensaje: "Platillo creado exitosamente" });
   } catch (err) {
       res.status(500).json({ mensaje: err.sqlMessage });
   }
});

/**
 * @swagger
 * /platillos/{id}:
 *   put:
 *     tags:
 *       - platillo
 *     summary: Actualizar un platillo por ID
 *     description: Modificar la información de un platillo existente en la base de datos
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del platillo
 *       - in: body
 *         name: platillo
 *         description: Nueva información del platillo
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             tipo_comida:
 *               type: string
 *             ingredientes:
 *               type: string
 *             region:
 *               type: string
 *             nivel_picante:
 *               type: string
 *             tipo_carne:
 *               type: string
 *             acompanamientos:
 *               type: string
 *             metodo_preparacion:
 *               type: string
 *             historia_contexto:
 *               type: string
 *             calorias:
 *               type: integer
 *             popularidad:
 *               type: integer
 *     responses:
 *       200:
 *         description: Platillo actualizado exitosamente
 *       404:
 *         description: Platillo no encontrado
 *       500:
 *         description: Error en el servidor
 */
app.put("/platillos/:id", async (req, res) => {
   try {
    const conn = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE
    });

       const [checkRows, checkFields] = await conn.query('SELECT * FROM Platillo WHERE id = ?', [req.params.id]);
       if (checkRows.length === 0) {
           res.status(404).json({ mensaje: "El platillo no existe" });
       } else {
           const {
               nombre,
               tipo_comida,
               ingredientes,
               region,
               nivel_picante,
               tipo_carne,
               acompanamientos,
               metodo_preparacion,
               historia_contexto,
               calorias,
               popularidad
           } = req.body;

           await conn.query('UPDATE Platillo SET nombre = ?, tipo_comida = ?, ingredientes = ?, region = ?, nivel_picante = ?, tipo_carne = ?, acompanamientos = ?, metodo_preparacion = ?, historia_contexto = ?, calorias = ?, popularidad = ? WHERE id = ?',
               [nombre, tipo_comida, ingredientes, region, nivel_picante, tipo_carne, acompanamientos, metodo_preparacion, historia_contexto, calorias, popularidad, req.params.id]);

           res.json({ mensaje: "Platillo actualizado exitosamente" });
       }
   } catch (err) {
       res.status(500).json({ mensaje: err.sqlMessage });
   }
});

/**
 * @swagger
 * /platillos/{id}:
 *   delete:
 *     tags:
 *       - platillo
 *     summary: Eliminar un platillo por ID
 *     description: Eliminar un platillo existente en la base de datos
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del platillo
 *     responses:
 *       200:
 *         description: Platillo eliminado exitosamente
 *       404:
 *         description: Platillo no encontrado
 *       500:
 *         description: Error en el servidor
 */
app.delete("/platillos/:id", async (req, res) => {
   try {
       const conn = await mysql.createConnection({
           host: HOST,
           user: USER,
           password: PASSWORD,
           database: DATABASE
       });

       const [checkRows, checkFields] = await conn.query('SELECT * FROM Platillo WHERE id = ?', [req.params.id]);
       if (checkRows.length === 0) {
           res.status(404).json({ mensaje: "El platillo no existe" });
       } else {
           await conn.query('DELETE FROM Platillo WHERE id = ?', [req.params.id]);
           res.json({ mensaje: "Platillo eliminado exitosamente" });
       }
   } catch (err) {
       res.status(500).json({ mensaje: err.sqlMessage });
   }
});


 const def = fs.readFileSync(path.join(__dirname,'/swagger.json'),{encoding: 'utf8',flag:'r'});
 const defObj = JSON.parse(def);

 const read = fs.readFileSync(path.join(__dirname,'/README.md'),{encoding: 'utf8',flag:'r'});

 defObj.info.description = read;

 const swaggerOptions={
    definition:defObj,
    apis: [`${path.join(__dirname,"./index.js")}`],
 }

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs,options));

app.use("/api-docs-json",(req,res)=>{
   res.json(swaggerDocs);
});

 // server redoc
 app.get(
   '/api-docs-redoc',
   redoc({
     title: 'API Docs',
     specUrl: '/api-docs-json',
     nonce: '', // <= it is optional,we can omit this key and value
     // we are now start supporting the redocOptions object
     // you can omit the options object if you don't need it
     // https://redocly.com/docs/api-reference-docs/configuration/functionality/
     redocOptions: {
       theme: {
         colors: {
           primary: {
             main: '#6EC5AB'
           }
         },
         typography: {
           fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
           fontSize: '15px',
           lineHeight: '1.5',
           code: {
             code: '#87E8C7',
             backgroundColor: '#4D4D4E'
           }
         },
         menu: {
           backgroundColor: '#ffffff'
         }
       }
     }
   })
 );


app.listen(PORT,()=>{
    console.log("Servidor express escuchando en el puerto " + PORT);
});
