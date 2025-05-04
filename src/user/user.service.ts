import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;

    // Ensure username, password, and email are defined
    if (!username || !password || !email) {
      throw new BadRequestException('Username, email, and password are required');
    }

    // Check if username already exists
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and save
    const user = this.userRepository.create({ username, email, password: hashedPassword });
    await this.userRepository.save(user);

    return { message: 'User has been added' };
  }


  async deleteById(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted' };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  

 //username update
 async updateUsername(id: number, newUsername: string): Promise<{ message: string }> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Check if new username is taken
  const existingUser = await this.userRepository.findOne({ where: { username: newUsername } });
  if (existingUser && existingUser.id !== id) {
    throw new ConflictException('Username already taken by another user');
  }

  user.username = newUsername;
  await this.userRepository.save(user);

  return { message: 'Username updated successfully' };
}

//password update
async updatePassword(id: number, newPassword: string): Promise<{ message: string }> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await this.userRepository.save(user);

  return { message: 'Password updated successfully' };
}
}
