import { RequestHandler } from "express"
import createHttpError from "http-errors"
import { verifyJwtToken } from "../utils/jwt"

const { JWT_ACCESS_KEY: ACCESS_KEY } = process.env
if (!ACCESS_KEY) throw new Error('Provide ACCESS KEY AND REFRESH KEY')

export const authenticateUser: RequestHandler = async (req: any, res, next) => {
    try {
        const { accessToken } = req.cookies
        const _id = await verifyJwtToken(accessToken, ACCESS_KEY)
        if (!_id) return next(createHttpError(401, 'Invalid Details'))
        // FIXME: REQUEST SHOULD NOT BE ANY
        req.user = _id
        next()
    } catch (error) {
        next(error)
    }
}