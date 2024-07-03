import express from "express";

//Route system
import mainRoutes from "./routes/main.js";

//App instance
const app = express();

// Using decoding middleware
app.use(express.urlencoded({ extended: false}));
//app.use(express.json());

// Setting template engine
app.set("view engine", 'ejs');

// http://localhost:3000/
app.use("/", mainRoutes);

app.listen("3000", () => console.log("Listening port 3000"));