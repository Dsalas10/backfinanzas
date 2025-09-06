require("dotenv").config();

require("./DataBase/DB");
const express = require("express");
const cors = require("cors");

const prestamosRouter = require("./Routes/prestamos.route");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());


// Importa la conexión a la base de datos

app.use("/api/prestamos", prestamosRouter);
app.use("/api/gastos", require("./Routes/gastos.route"));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
