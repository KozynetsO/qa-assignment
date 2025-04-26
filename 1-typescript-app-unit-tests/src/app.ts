import express from "express";
import { getUsers, getUser, addUser, updateUser, deleteUser } from "./controllers";

const app = express();

app.use(express.json());

app.get("/api/users", getUsers);
app.post("/api/users", addUser);
app.get("/api/users/:id", getUser);
app.patch("/api/users/:id", updateUser);
app.delete("/api/users/:id", deleteUser);

export default app;