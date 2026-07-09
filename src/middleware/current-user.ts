import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface userPayload {
    id: string;
    email: string;
}

interface RequestWithSession extends Request {
    session?: {
        jwt?: string
    }
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: userPayload
        }
    }
}

export const currentUser = (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        return res.send({ currentUser: null })
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as userPayload
        req.currentUser = payload

    } catch (error) { }

    next();
}