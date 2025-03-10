import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, ObjectId, Promise, Types} from 'mongoose';
import {User, UserDocument} from '../../../../../shared/entities/user.entity';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import {UpdateUserDto} from "../../../../application/dto/update-user.dto";

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    async create(user: User): Promise<UserDocument> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id);
    }

    async update(
        id: any,
        updateUserDto: UpdateUserDto,
    ): Promise<UserDocument> {
        return this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }

    save(user: User): Promise<UserDocument> {
        return Promise.resolve(undefined);
    }
}