require("dotenv").config();

require("./DataBase/DB");
const express = require("express");
const cors = require("cors");

const prestamosRouter = require("./Routes/prestamos.route");
const loginRouter = require("./Routes/Login.route");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : []; // E.g., "origin1,origin2"

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
  })
);
app.use(express.json());

// Importa la conexión a la base de datos

app.use("/api/prestamo", prestamosRouter);
app.use("/api/", require("./Routes/gastos.route"));
app.use("/api", loginRouter);
app.use("/api/usuarios", require("./Routes/usuarios.route"));
app.use("/api/eventos", require("./Routes/eventos.route"));

// Ruta de prueba

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
