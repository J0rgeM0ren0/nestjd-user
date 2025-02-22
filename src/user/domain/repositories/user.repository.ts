import { User } from '../../../shared/entities/user.entity';

export interface UserRepository {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    delete(id: string): Promise<void>;
    create(user: User): Promise<User>;
}