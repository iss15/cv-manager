import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['auth-user'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const token = authHeader as string;

      // Get the secret key from the .env file
      const secret = this.configService.get<string>('JWT_SECRET');

      // Verify the token using the secret key
      if (!secret) {
        return res.status(500).json({ message: 'JWT secret is not configured.' });
      }
      const decoded = verify(token, secret, { algorithms: ['HS256'] });
      const { userId } = decoded as { userId: number };

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token. No userId found.' });
      }

      // Inject userId into the request object
      req['userId'] = userId;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
      }
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Invalid token.' });
    }
  }
}

/*
1.Validate the Token:
  -The middleware checks if the token is present in the auth-user header.
  -It verifies the token using the secret key (JWT_SECRET) from the .env file.

2.Extract User Information:
  -The middleware decodes the token to extract the userId and other claims.

3.Authorize Requests:
  -If the token is valid, the userId is attached to the req object, 
  allowing subsequent route handlers to identify the user.
  -If the token is invalid or expired, the middleware responds with a 401 Unauthorized error.
*/