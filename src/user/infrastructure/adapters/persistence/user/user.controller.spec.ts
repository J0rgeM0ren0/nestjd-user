import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { CreateUserDto } from '../../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../../application/dto/update-user.dto';
import { LoginUserDTO } from '../../../../application/dto/login-user.dto';
import {
    registerUser,
    resultRegisterUser,
    resultUserLogin,
    updateUser, userId,
    userLogin
} from "../../../../../../__mocks/userMock";

describe('UserController', () => {
    let userController: UserController;
    let userUseCase: UserUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserUseCase,
                    useValue: {
                        registerUser: jest.fn(),
                        loginUser: jest.fn(),
                        logoutUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userUseCase = module.get<UserUseCase>(UserUseCase);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe('user controller', () => {
        it('should register a user successfully', async () => {
            const createUserDto: CreateUserDto = registerUser;
            jest.spyOn(userUseCase, 'registerUser').mockResolvedValue(resultRegisterUser);
            expect(await userController.register(createUserDto)).toBe(resultRegisterUser);
        });

        it('should login a user successfully', async () => {
            const loginUserDTO: LoginUserDTO = userLogin;
            jest.spyOn(userUseCase, 'loginUser').mockResolvedValue(resultUserLogin);

            expect(await userController.login(loginUserDTO)).toBe(resultUserLogin);
        });

        it('should update a user successfully', async () => {
            const updateUserDto: UpdateUserDto = updateUser;
            jest.spyOn(userUseCase, 'logoutUser').mockResolvedValue(undefined);

            expect(await userController.update(userId, updateUserDto)).toBe(undefined);
        });
    });
});