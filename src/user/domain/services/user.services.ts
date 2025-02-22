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
            this.client.emit('topic-test', newUser.email);
            return;
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

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}