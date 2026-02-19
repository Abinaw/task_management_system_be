const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  ConflictException,
  BadRequestException,
} = require("../errors/AppError");
const console = require("node:console");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      console.error("All fields are required");
      throw new BadRequestException("All fields are required");
    }

    if (!(password === confirmPassword)) {
      console.error("Password does not match!");
      throw new BadRequestException("Password does not match!");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      console.error("Email already in use");
      throw new ConflictException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error("Invalid email or password");
      throw new BadRequestException("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid email or password");
      throw new BadRequestException("Invalid email or password");
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
