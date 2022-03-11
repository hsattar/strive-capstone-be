import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserSchema'
import { IUserDoc } from '../types-local/users'

const { JWT_ACCESS_KEY: ACCESS_KEY, JWT_REFRESH_KEY: REFRESH_KEY } = process.env
if (!ACCESS_KEY || !REFRESH_KEY) throw new Error('Provide ACCESS KEY AND REFRESH KEY')

interface IPayload {
    _id: string
}

export const createNewTokens = async (user: IUserDoc) => {
    try {
        const accessToken = await generateJwtToken({ _id: user._id }, ACCESS_KEY, '15 m')
        const refreshToken = await generateJwtToken({ _id: user._id }, REFRESH_KEY, '1 week')
        user.refreshToken = refreshToken
        await user.save()
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw new Error('Could not create tokens')
    }
}

const generateJwtToken = (payload: IPayload, secret: string, expiresIn: string): Promise<string> => new Promise((resolve, reject) => 
jwt.sign(payload, secret, { expiresIn }, (err, token) => {
    if (err) return reject(err)
    resolve(token as string)
}))

export const verifyJwtToken = (token: string, secret: string): Promise<IPayload> => new Promise((resolve, reject) =>
jwt.verify(token, secret, (err, payload) => {
    if (err) return reject(err)
    resolve(payload as IPayload)
}))

export const verifyTokenAndRegenrate = async (token: string) => {
    try {
        const { _id } = await verifyJwtToken(token, REFRESH_KEY)
        if (!_id) throw createHttpError(401, 'Invalid Token')
        const user = await UserModel.findById(_id)
        if (!user) throw createHttpError(404, 'User not found')
        const { accessToken, refreshToken } = await createNewTokens(user)
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw createHttpError(401, 'Invalid Token')
    }
}