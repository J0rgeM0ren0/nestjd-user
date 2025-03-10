import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { CreateUserDto } from '../../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../../application/dto/update-user.dto';
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

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userUseCase.logoutUser(id, updateUserDto);
    }
}