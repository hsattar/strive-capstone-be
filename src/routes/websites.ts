import { NextFunction, Response, Router } from 'express'
import { IUserRequest } from '../types-local/users'
import q2m from 'query-to-mongo'
import WebsiteModel from '../models/websiteSchema'
import UserModel from '../models/UserSchema'

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
        const website = new WebsiteModel({ ...req.body, owner: req.user?._id })
        await website.save()
        const user = await UserModel.findById(req.user?._id)
        user?.websites.push(website._id)
        await user!.save()
        res.send(website)
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