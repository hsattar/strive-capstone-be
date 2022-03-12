import { NextFunction, Response, Router } from 'express'
import { IUserRequest } from '../types-local/users'
import WebsiteModel from '../models/websiteSchema'
import UserModel from '../models/UserSchema'
import { createWebsiteValidation } from '../middleware/websiteValidation'
import { checkValidationErrors } from '../middleware/errorHandlers'
import createHttpError from 'http-errors'

const websiteRouter = Router()

websiteRouter.route('/')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const websites = await WebsiteModel.find({ owner: req.user?._id})
        res.send(websites)
    } catch (error) {
        next(error)
    }
})
.post(createWebsiteValidation, async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        checkValidationErrors(req)
        const website = new WebsiteModel({ ...req.body, owner: req.user?._id })
        await website.save()
        const user = await UserModel.findById(req.user?._id)
        user?.websites.push(website._id)
        await user!.save()
        res.status(201).send(website)
    } catch (error) {
        next(error)
    }
})

websiteRouter.delete('/:websiteName', async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name } = req.params
        const websites = await WebsiteModel.find({ name })
        if (websites.length === 0) return next(createHttpError(404, `Couldn't find the website`)) 
        const deleted = websites.map(async website => {
            await WebsiteModel.findByIdAndDelete(website._id)
            await UserModel.findByIdAndUpdate(req.user?._id, { $pull: { websites: website._id } })
        })
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteName/:websitePage/:websiteStage')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const website = await WebsiteModel.findOne({ name, page, stage, owner: req.user?._id })
        if (!website) return next(createHttpError(404, 'Website Not Found'))
        res.send(website)
    } catch (error) {
        next(error)
    }
})
.put(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const website = await WebsiteModel.findOne({ name, page, stage })
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