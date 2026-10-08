import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

class AuthService {
  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const email = data.email.toLowerCase().trim();

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = userRepository.create({
      name: data.name.trim(),
      email,
      passwordHash,
      role: UserRole.CUSTOMER,
    });

    const savedUser = await userRepository.save(user);

    const payload = {
      userId: savedUser.id,
      role: savedUser.role,
    };

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  async login(data: {
    email: string;
    password: string;
  }) {
    const email = data.email.toLowerCase().trim();

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const user = await userRepository.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    return {
      accessToken,
      user,
    };
  }

  async getUserById(id: string) {
    return await userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export default new AuthService();