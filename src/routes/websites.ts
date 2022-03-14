import { NextFunction, Response, Router } from 'express'
import { IUserRequest } from '../types-local/users'
import WebsiteModel from '../models/websiteSchema'
import UserModel from '../models/UserSchema'
import { createWebsiteValidation, saveWebsiteValidation } from '../middleware/websiteValidation'
import { checkValidationErrors } from '../middleware/errorHandlers'
import createHttpError from 'http-errors'
import { parser } from '../utils/cloudinary'

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

websiteRouter.post('/upload-image', parser.single('image'),  async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file?.path) return next(createHttpError(400, 'File Not Uploaded'))
        res.status(201).send(req.file.path)
    } catch (error) {
        console.log(error)
    }
})

websiteRouter.route('/:websiteName')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name } = req.params
        const websites = await WebsiteModel.find({ name, stage: 'development', owner: req.user?._id }, { page: 1, _id: 0 })
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
        const websites = await WebsiteModel.find({ name, owner: req.user?._id})
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
        const websites = await WebsiteModel.find({ name, page, owner: req.user?._id })
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
.put(saveWebsiteValidation, async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        checkValidationErrors(req)
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const { code, structure } =req.body
        const website = await WebsiteModel.findOneAndUpdate({ name, page, stage, owner: req.user?._id }, { code, structure })
        if (!website) return next(createHttpError(404, 'Website Not Found'))
        res.send(website)
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
        const { websiteName: name, websitePage: page } = req.params
        const website = await WebsiteModel.findOne({ name, page, stage: 'development', owner: req.user?._id}, { code: 1, _id: 0 })
        if (!website) return res.send('<div class="flex justify-center"><h2 class="mt-12 text-3xl">Website Does Not Exist</h2></div>')
        res.send(website.code)
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteName/:websitePage/:websiteStage/publish')
.put(saveWebsiteValidation, async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        checkValidationErrors(req)
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const { code } =req.body
        const website = await WebsiteModel.findOneAndUpdate({ name, page, stage, owner: req.user?._id }, { code })
        if (!website) {
            const newWebsite = new WebsiteModel({ owner: req.user?._id, name, page, stage, code })
            await newWebsite.save()
            res.status(201).send(newWebsite)
        }
        res.send(website)
    } catch (error) {
        next(error)
    }
})

export default websiteRouter