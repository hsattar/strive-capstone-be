declare module 'express-serve-static' {
    interface Request {
        user: IPayload
    }
} 