import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: { email }
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "A user with this email already exists"
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash
        }
      });

    res.status(201).json({
      message:
        "User registered successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed"
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required"
      });
    }

    const user =
      await prisma.user.findUnique({
        where: { email }
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};