import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.services'
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDTO } from "../dto/login-user.dto";
import {UpdateUserDto} from "../dto/update-user.dto";

@Injectable()
export class UserUseCase {
    constructor(private readonly userService: UserService) {}

    async registerUser(createUserDto: CreateUserDto) {
        return await this.userService.register(createUserDto);
    }

    async loginUser(loginUserDTO: LoginUserDTO) {
        return await this.userService.login(loginUserDTO);
    }
    async logoutUser(id: string, updateUserDTO: UpdateUserDto) {
        return await this.userService.logout(id, updateUserDTO);
    }
}