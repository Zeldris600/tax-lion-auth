import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { Otp } from '../auth/entities/otp.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, phone, password } = createUserDto;

    // Create a new user instance
    const user = this.usersRepository.create({
      name,
      phone,
      password,
      createdAt: new Date(),
    });

    return this.usersRepository.save(user);
  }
  async findByPhone(phone: string) {
    return this.usersRepository.findOneBy({ phone });
  }

  async findById(
    id: string
  ) {
    return await this.usersRepository.findOneBy({ id: new ObjectId(id) });
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    console.log('id is => ', id);

    const user = await this.usersRepository.findOneBy(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = Object.assign(user, updateUserDto);

    return this.usersRepository.save(updatedUser);
  }

  async updateOtp(userId: string, code: string, expiresAt: Date) {
    const otp = await this.otpRepository.findOne({
      where: { user: { id: new ObjectId(userId) } },
    });

    if (otp) {
      otp.code = code;
      otp.expiresAt = expiresAt.getTime();
      await this.otpRepository.save(otp);
    } else {
      const newOtp = this.otpRepository.create({
        code: code,
        expiresAt: expiresAt.getTime(),
        user: { id: userId },
      });
      await this.otpRepository.save(newOtp);
    }
  }

  async verifyOtp(phone: string, code: string) {
    const user = await this.findByPhone(phone);

    if (!user || !user.otps || user.otps.length === 0) {
      return null;
    }

    const otp = user.otps.find((otp) => otp.code === code && otp.expiresAt > Date.now());

    if (!otp) {
      return null;
    }

    return user;
  }



}
