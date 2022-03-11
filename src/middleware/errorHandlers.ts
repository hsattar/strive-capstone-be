import { Request } from 'express'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { ErrorRequestHandler } from "express"

export const checkValidationErrors = (request: Request) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) throw createHttpError(400, errors)
}

export const errorHandlers: ErrorRequestHandler = (err, req, res, next) => {
    console.log('THE ERROR', err)
    switch (err.name) {
        case 'ValidationError':
        case 'BadRequestError':
        case 'MongoServerError':
        case 'SyntaxError':
            return res.status(400).send(err)
        case 'UnauthorizedError':
        case 'JsonWebTokenError':
        case 'TokenExpiredError':
            return res.status(401).send(err.message)
        case 'ForbiddenError':
            return res.status(403).send(err.message)
        case 'NotFoundError':
            return res.status(404).send(err)
        default:
            console.log(err);
            return res.status(500).send('Server Error')
    }
}