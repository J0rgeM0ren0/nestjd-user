import { Controller, Post, Body } from '@nestjs/common';
import { UserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { CreateUserDto } from '../../../../application/dto/create-user.dto';
import { LoginUserDTO } from "../../../../application/dto/login-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.userUseCase.registerUser(createUserDto);
    }

    @Post('login')
    login(@Body() user: LoginUserDTO) {
        return this.userUseCase.loginUser(user);
    }
}