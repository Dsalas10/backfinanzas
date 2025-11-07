require("dotenv").config();

require("./DataBase/DB");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin:[
      "https://gestorfinanzas-dsalas10-daniels-projects-e5cb67ed.vercel.app",
       "http://localhost:5173" 
    ]
  })
); // Origen específico de tu frontend
app.use(express.json());

const ingresoExtraRouter = require("./Routes/IngresoExtra.route");
const loginRouter = require("./Routes/Login.route");

// Importa la conexión a la base de datos

app.use("/api/ingresoextra", ingresoExtraRouter);
app.use("/api/", require("./Routes/gastos.route"));
app.use("/api", loginRouter);
app.use("/api/usuarios", require("./Routes/usuarios.route"));
app.use("/api/eventos", require("./Routes/eventos.route"));
app.use("/api/resumen", require("./Routes/resumen.route"));

// Ruta de prueba

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
