// USE THIS WEBSITE FOR JWT GENETION : http://jwtbuilder.jamiekurtz.com/
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['auth-user']; 

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const token = authHeader as string; 
      const decoded = verify(token, 'my-256-bit-secret', { algorithms: ['HS256'] }); 
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
How It Works
The middleware checks for the presence of the auth-user header in the incoming request.
If the header is missing, it responds with a 401 Unauthorized status.
If the header exists, it verifies the JWT using the verify function from the jsonwebtoken library.
If the token is valid, it extracts the userId from the token payload and injects it into the request object (req['userId']).
If the token is invalid or does not contain a userId, it responds with a 401 Unauthorized status.
If everything is valid, it calls next() to pass control to the next middleware or route handler.
*/