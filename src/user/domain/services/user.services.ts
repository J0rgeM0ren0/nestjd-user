import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository'
import { User } from '../../../shared/entities/user.entity';
import { CreateUserDto } from "../../application/dto/create-user.dto";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from "../../application/dto/login-user.dto";
import { ClientKafka } from "@nestjs/microservices";
import {UpdateUserDto} from "../../application/dto/update-user.dto";
import { Types } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        @Inject('USER_SERVICE') private readonly client: ClientKafka
    ) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = new User();
            newUser.name = createUserDto.name;
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.phone = createUserDto.phone ?? '';
            newUser.refreshToken = createUserDto.refreshToken ?? "";
            this.client.emit('topic-test', newUser.email);
            await this.userRepository.create(newUser);
            return newUser;
        }catch (error) {
            if (error.code.toString() === '11000') {
                this.client.emit('user_already_exist2', 'already exist');
                throw new BadRequestException('Ya existe un usuario con este email');
            }
            this.client.emit('user_error', 'user error');
            throw new InternalServerErrorException('Error al crear el usuario');
        }
    }

    async login(loginUserDTO : LoginUserDTO): Promise<any> {
        const user = await this.userRepository.findByEmail(loginUserDTO.email);
        if (user?.password !== loginUserDTO.password) {
            throw new BadRequestException('email o clave incorrecto');
        }

        const payload = { sub: user._id, email: user.email };

        const access_token = await this.jwtService.signAsync(payload);
        const updateUser : UpdateUserDto = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            refreshToken: access_token,
        };
        await this.userRepository.update(user._id, updateUser);
        return access_token;
    }

    async logout(userId: string, updateUserDTO: UpdateUserDto) {
        updateUserDTO.refreshToken = "";
        const id = new Types.ObjectId(userId);
        await this.userRepository.update(id, updateUserDTO);
    }
}