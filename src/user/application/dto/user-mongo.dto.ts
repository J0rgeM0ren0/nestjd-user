export class UserMongoDto {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    refreshToken?: string;
}