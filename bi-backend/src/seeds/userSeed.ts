import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

async function seed() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  const demo = userRepo.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    password: "123456",
  });
  
  await userRepo.save(demo);

  console.log("Seed completed");
  await AppDataSource.destroy();
}

seed();
