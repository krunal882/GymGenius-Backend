import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'; // Import necessary decorators and utilities from @nestjs/common
import { JwtService } from '@nestjs/jwt'; // Import JwtService from @nestjs/jwt
import { Request } from 'express'; // Import Request from express
import { ConfigService } from '@nestjs/config'; // Import ConfigService from @nestjs/config

@Injectable()
export class AuthGuard implements CanActivate {
  // Define AuthGuard class implementing CanActivate interface
  constructor(
    private jwtService: JwtService, // Inject JwtService
    private configService: ConfigService, // Inject ConfigService
  ) {}

  // Method to determine if the current request can proceed
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Get the request object from the context
    const token = this.extractTokenFromHeader(request); // Extract the token from the request header
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // Verify the token using the JWT secret from the config
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request['user'] = payload; // Attach the payload (user info) to the request object
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true; // Allow the request to proceed
  }

  // Method to extract the token from the authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return undefined; // If no authorization header is found, return undefined
    }
    const [type, token] = authorizationHeader.split(' '); // Split the authorization header into type and token

    return type === 'Bearer' ? token : undefined; // Return the token if the type is 'Bearer', otherwise return undefined
  }
}
