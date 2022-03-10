import { NextFunction, Request, Response, Router } from 'express'

const userRouter = Router()

userRouter.route('/')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.post(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

userRouter.route('/:userId')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.put(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default userRouter