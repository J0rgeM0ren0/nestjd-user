import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.services';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { LoginUserDTO } from '../../application/dto/login-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { User } from '../../../shared/entities/user.entity';
import {of} from "rxjs";
import {
    registerUser,
    resultUserLogin,
    updateUserServices,
    userId,
    userLogin,
    userMongo
} from "../../../../__mocks/userMock";
import {UserMongoDto} from "../../application/dto/user-mongo.dto";
import {Types} from "mongoose";

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;
    let jwtService: JwtService;
    let clientKafka: ClientKafka;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: 'UserRepository',
                    useValue: {
                        create: jest.fn(),
                        findByEmail: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
                {
                    provide: 'USER_SERVICE',
                    useValue: {
                        emit: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>('UserRepository');
        jwtService = module.get<JwtService>(JwtService);
        clientKafka = module.get<ClientKafka>('USER_SERVICE');
    });

    it('should successfully register a new user', async () => {
        const createUserDto: CreateUserDto = registerUser;

        const newUser = new User();
        newUser.name = createUserDto.name;
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;
        newUser.phone = createUserDto.phone;
        newUser.refreshToken = "";

        jest.spyOn(userRepository, 'create').mockResolvedValue(newUser as any);
        jest.spyOn(clientKafka, 'emit').mockImplementation((pattern: any, data: unknown) => of(data));

        const result = await userService.register(createUserDto);

        expect(result).toEqual(newUser);
        expect(clientKafka.emit).toHaveBeenCalledWith('topic-test', newUser.email);
        expect(userRepository.create).toHaveBeenCalledWith(newUser);
    });

    it('should throw BadRequestException if email already exists', async () => {
        const createUserDto: CreateUserDto = registerUser;

        const error = { code: 11000 };
        jest.spyOn(userRepository, 'create').mockRejectedValue(error);
        jest.spyOn(clientKafka, 'emit').mockImplementation((pattern: any, data: unknown) => of(data));

        await expect(userService.register(createUserDto)).rejects.toThrowError(
            new BadRequestException('Ya existe un usuario con este email'),
        );
        expect(clientKafka.emit).toHaveBeenCalledWith('user_already_exist2', 'already exist');
    });

    it('should successfully login and return an access token', async () => {
        const loginUserDto: LoginUserDTO = userLogin;

        const user : UserMongoDto = userMongo;

        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user as any);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue(resultUserLogin);
        jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

        const result = await userService.login(loginUserDto);

        expect(result).toEqual(resultUserLogin);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(loginUserDto.email);
        expect(jwtService.signAsync).toHaveBeenCalledWith({
            sub: user._id,
            email: user.email,
        });
        expect(userRepository.update).toHaveBeenCalledWith(user._id, {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            refreshToken: resultUserLogin,
        });
    });

    it('should throw BadRequestException if password is incorrect', async () => {
        const loginUserDto: LoginUserDTO = {
            email: 'test3920251@gmail.com',
            password: 'wrongpassword',
        };

        const user : UserMongoDto = userMongo;

        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user as any);

        await expect(userService.login(loginUserDto)).rejects.toThrowError(
            new BadRequestException('email o clave incorrecto'),
        );
    });

    it('should successfully logout a user', async () => {
        const updateUserDto: UpdateUserDto = updateUserServices;

        jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

        await userService.logout(userId, updateUserDto);

        expect(userRepository.update).toHaveBeenCalledWith(new Types.ObjectId(userId), {
            ...updateUserDto,
            refreshToken: "",
        });
    });
});