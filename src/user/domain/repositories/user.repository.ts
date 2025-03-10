import { User, UserDocument } from '../../../shared/entities/user.entity';
import {UpdateUserDto} from '../../application/dto/update-user.dto';
import { Types } from "mongoose";

export interface UserRepository {
    save(user: User): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    delete(id: string): Promise<void>;
    create(user: User): Promise<UserDocument>;
    update(id: any, updateUserDto: UpdateUserDto): Promise<UserDocument>;
}