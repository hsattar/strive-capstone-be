declare module 'query-to-mongo'

declare module 'express-serve-static' {
    interface Request {
        user: IPayload
    }
} 