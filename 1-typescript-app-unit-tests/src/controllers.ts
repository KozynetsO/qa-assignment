import db from "./db";
import { Request, Response } from "express";
import { User } from "./models/user";
import { UserCreateSchema } from "./schemas/userSchema";

export const getUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const user: User = db.users.find(user => user.id === id);

    if (!user) return res.status(404).json({ errors: ["User not found"] });

    return res.json(user);
};

export const getUsers = (req: Request, res: Response) => {
    const { name, age } = req.query;
    let filteredUsers = db.users;

    if (name) {
        const nameFilter = name as string;
        filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    if (age) {
        const ageFilter = parseInt(age as string);
        filteredUsers = filteredUsers.filter(user => user.age === ageFilter);
    }

    return res.json(filteredUsers);
};

export const addUser = (req: Request, res: Response) => {
    const result = UserCreateSchema.safeParse(req.body);
  
    if (!result.success) {
        return res.status(400).json({
            errors: result.error.errors.map((err) => err.message)
        });
    }
  
    const newUser: User = {
      id: Date.now().toString(),
      name: result.data.name,
      age: result.data.age,
    };
  
    db.users.push(newUser);

    return res.status(201).json(newUser);
  };

export const updateUser = (req: Request, res: Response) => {
    const result = UserCreateSchema.partial().safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.errors.map((err) => err.message)
        });
    }

    const { id } = req.params;
    const { name, age } = req.body;
    const user: User = db.users.find(user => user.id === id);

    if (!user) return res.status(404).json({ errors: ["User not found"] });

    if (name) user.name = name;
    if (age) user.age = age;

    return res.json(user);
};

export const deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    const index = db.users.findIndex(user => user.id === id);

    if (index === -1) return res.status(404).json({ errors: ["User not found"] });

    db.users.splice(index, 1);
    res.status(204).send();
};