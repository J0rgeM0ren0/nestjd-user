import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('Falta authorization');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Falta token');
        }

        try {
            request.user = this.jwtService.verify(token);
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token invalido o expiro');
        }
    }
}