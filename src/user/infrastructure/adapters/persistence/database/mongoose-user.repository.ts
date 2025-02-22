import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Promise} from 'mongoose';
import { User } from '../../../../../shared/entities/user.entity';
import { UserRepository } from '../../../../domain/repositories/user.repository';

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    async create(user: User): Promise<User> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async save(user: User): Promise<User> {
        return Promise.resolve(undefined);
    }
}