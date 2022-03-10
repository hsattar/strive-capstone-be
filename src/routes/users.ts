import { NextFunction, Request, Response, Router } from 'express'
import { userLoginValidation, userRegistrationValidation } from '../middleware/validation'
import UserModel from '../models/UserSchema'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

const userRouter = Router()

userRouter.post('/register', userRegistrationValidation, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const user = new UserModel(req.body)
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

userRouter.post('/login', userLoginValidation, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const { email, password } = req.body
        const user = await UserModel.authenticate(email, password)
        if (!user) return next(createHttpError(401, 'Invalid Credentials'))
        res.send(user)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default userRouter