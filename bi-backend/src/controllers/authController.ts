import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userData = (req as any).user;
    const user = await userRepo.findOneBy({ id: userData.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const exist = await userRepo.findOneBy({ email });
    if (exist) return res.status(400).json({ message: "Email already registered" });

    const user = userRepo.create({ firstName, lastName, email, password, role });
    await userRepo.save(user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const expiresIn = remember ? 7 * 24 * 60 * 60 : 2 * 60 * 60;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn }
    );

    res.json({
      token,
      expiresIn,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
