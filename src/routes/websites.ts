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
        const websites = await WebsiteModel.find({ owner: req.user?._id, page: 'home', stage: 'development' })
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

websiteRouter.route('/:websiteName')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name } = req.params
        const websites = await WebsiteModel.find({ name }, { page: 1, _id: 0 })
        if (websites.length === 0) return next(createHttpError(404, `Couldn't find the website`))
        const websitePages = websites.map(website => website.page)
        res.send(websitePages)
    } catch (error) {
        next(error)
    }
})
.delete(async (req: IUserRequest, res: Response, next: NextFunction) => {
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

websiteRouter.route('/:websiteName/:websitePage')
.delete(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name, websitePage: page } = req.params
        const websites = await WebsiteModel.find({ name, page })
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

websiteRouter.route('/:websiteName/:websitePage/:websiteStage/code')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const website = await WebsiteModel.findOne({ name, page, stage, owner: req.user?._id }, { code: 1, _id: 0 })
        if (!website) return res.send('<div class="flex justify-center"><h2 class="mt-12 text-3xl">Website Does Not Exist</h2></div>')
        res.send(website.code)
    } catch (error) {
        next(error)
    }
})

export default websiteRouter