import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from 'bcryptjs'

const registerUserSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, "Invalid username."),
  name: z.string().regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/, "Invalid name"),
  password: z.string().max(8, "Password should have maximun 8 characters.").regex(/^(?=.*?[A-Z].*?[A-Z])(?=.*?[a-z])(?=.*?[0-9].*?[0-9]).{2,8}$/, "Invalid password."),
});

const prisma = new PrismaClient();

async function registerUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password, name } = registerUserSchema.parse(req.body);

  if (!username || !password || !name) {
    return res.send({user: null, message: "Incomplete register."})
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user !== null) {
    return res.send({ user: null, message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name
    },
  });

  res.send({user: newUser, message: "User Created Succesfully."})
}

export default registerUser