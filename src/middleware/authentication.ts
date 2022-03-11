import { NextFunction, Response } from "express"
import createHttpError from "http-errors"
import { IUserRequest } from "../types-local/users"
import { verifyJwtToken } from "../utils/jwt"

const { JWT_ACCESS_KEY: ACCESS_KEY } = process.env
if (!ACCESS_KEY) throw new Error('Provide ACCESS KEY AND REFRESH KEY')

export const authenticateUser = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { accessToken } = req.cookies
        const _id = await verifyJwtToken(accessToken, ACCESS_KEY)
        if (!_id) return next(createHttpError(401, 'Invalid Details'))
        req.user = _id
        next()
    } catch (error) {
        next(error)
    }
}