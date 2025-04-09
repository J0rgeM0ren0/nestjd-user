import { Test, TestingModule } from '@nestjs/testing';
import { UserUseCase } from './register-user.use-case';
import { UserService } from '../../domain/services/user.services';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {registerUser, updateUser, userId, userLogin} from "../../../../__mocks/userMock";

describe('UserUseCase', () => {
    let userUseCase: UserUseCase;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserUseCase,
                {
                    provide: UserService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                        logout: jest.fn(),
                    },
                },
            ],
        }).compile();

        userUseCase = module.get<UserUseCase>(UserUseCase);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userUseCase).toBeDefined();
    });

    it('should call userService.register', async () => {
        const createUserDto: CreateUserDto = registerUser;

        userService.register = jest.fn().mockResolvedValue('user_registered');

        const result = await userUseCase.registerUser(createUserDto);
        expect(userService.register).toHaveBeenCalledWith(createUserDto);
        expect(result).toBe('user_registered');
    });

    it('should call userService.login', async () => {
        const loginUserDto: LoginUserDTO = userLogin;

        userService.login = jest.fn().mockResolvedValue('user_logged_in');

        const result = await userUseCase.loginUser(loginUserDto);
        expect(userService.login).toHaveBeenCalledWith(loginUserDto);
        expect(result).toBe('user_logged_in');
    });

    it('should call userService.logout', async () => {
        const id = userId;
        const updateUserDto: UpdateUserDto = updateUser;

        userService.logout = jest.fn().mockResolvedValue('user_logged_out');

        const result = await userUseCase.logoutUser(id, updateUserDto);
        expect(userService.logout).toHaveBeenCalledWith(id, updateUserDto);
        expect(result).toBe('user_logged_out');
    });
});