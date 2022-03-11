import { NextFunction, Request, Response, Router } from 'express'
import { accessTokenValidation, userLoginValidation, userRefreshTokenValidation, userRegistrationValidation } from '../middleware/userValidation'
import UserModel from '../models/UserSchema'
import createHttpError from 'http-errors'
import { createNewTokens, verifyTokenAndRegenrate } from '../utils/jwt'
import { checkValidationErrors } from '../middleware/errorHandlers'
import { authenticateUser } from '../middleware/authentication'
import { IUserRequest } from '../types-local/users'

const userRouter = Router()

const { NODE_ENV } = process.env

userRouter.get('/me', accessTokenValidation, authenticateUser, async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return next(createHttpError(400, 'No User'))
        const me = await UserModel.findById(req.user._id)
        res.send(me)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/register', userRegistrationValidation, async (req: Request, res: Response, next: NextFunction) => {
    try {
        checkValidationErrors(req)
        const user = new UserModel(req.body)
        await user.save()
        const { accessToken, refreshToken } = await createNewTokens(user)
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined })
        res.status(201).send(user)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/login', userLoginValidation, async (req: Request, res: Response, next: NextFunction) => {
    try {
        checkValidationErrors(req)
        const { email, password } = req.body
        const user = await UserModel.authenticate(email, password)
        if (!user) return next(createHttpError(401, 'Invalid Credentials'))
        const { accessToken, refreshToken } = await createNewTokens(user)
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined })
        res.send(user)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/refresh-token', userRefreshTokenValidation, async (req: Request, res: Response, next: NextFunction) => {
    try {
        checkValidationErrors(req)
        const { refreshToken: oldRefreshToken } = req.cookies
        const { accessToken, refreshToken } = await verifyTokenAndRegenrate(oldRefreshToken)
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined })
        res.send('Tokens Sent')
    } catch (error) {
        next(error)
    }
})

export default userRouter