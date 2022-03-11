import { NextFunction, Response, Router } from 'express'
import { IUserRequest } from '../types-local/users'
import q2m from 'query-to-mongo'

const websiteRouter = Router()

websiteRouter.route('/')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
})
.post(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteId')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
})
.put(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
})
.delete(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

export default websiteRouter