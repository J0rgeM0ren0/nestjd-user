import { Controller, Post, Body } from '@nestjs/common';
import { UserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { CreateUserDto } from '../../../../application/dto/create-user.dto';
import { LoginUserDTO } from "../../../../application/dto/login-user.dto";
import {EventPattern} from "@nestjs/microservices";

@Controller('user')
export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}

    @EventPattern('topic-test')
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.userUseCase.registerUser(createUserDto);
    }

    @Post('login')
    login(@Body() user: LoginUserDTO) {
        return this.userUseCase.loginUser(user);
    }
}