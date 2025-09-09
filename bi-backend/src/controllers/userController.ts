import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";

const userRepo = AppDataSource.getRepository(User);

export const getUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = "id", order = "ASC", search = "", role = "", ...filters } = req.query;
  let users: User[] = [];
  let total = 0;
  const queryBuilder = userRepo.createQueryBuilder("user");

  console.log(role, 'ini adalah role');
  
  if (search) {
    queryBuilder.where("user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search", { search: `%${search}%` });
  }

  if (role) {
      queryBuilder.where("user.role = :role", { role });
  }

  Object.keys(filters).forEach((key) => {
    queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: filters[key as keyof typeof filters] });
  });

  const [result, count] = await queryBuilder
    .orderBy(`user.${String(sort)}`, order as "ASC" | "DESC")
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getManyAndCount();

  users = result;
  total = count;

  const totalPages = Math.ceil(total / Number(limit));
  res.json({
    data: users,
    meta: {
      total,
      totalPages,
      page: Number(page),
      limit: Number(limit)
    }
  });
};

export const getUser = async (req: Request, res: Response) => {
  const user = await userRepo.findOneBy({ id: Number(req.params.id) });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {

  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "First name, last name, email, and password are required" });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepo.create({ firstName, lastName, email, password: hashedPassword });
    await userRepo.save(user);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {

  if (!req.body.firstName && !req.body.lastName && !req.body.email && !req.body.password) {
    return res.status(400).json({ message: "At least one field (firstName, lastName, email, password) is required" });
  }

  const user = await userRepo.findOneBy({ id: Number(req.params.id) });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  userRepo.merge(user, req.body);
  await userRepo.save(user);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await userRepo.delete({ id: Number(req.params.id) });
  if (result.affected === 0) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
