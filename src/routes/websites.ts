import axios from 'axios'
import { NextFunction, Response, Router } from 'express'
import createHttpError from 'http-errors'
import { checkValidationErrors } from '../middleware/errorHandlers'
import { createWebsiteValidation, saveWebsiteValidation } from '../middleware/websiteValidation'
import UserModel from '../models/UserSchema'
import WebsiteModel from '../models/websiteSchema'
import { IUserRequest } from '../types-local/users'

const websiteRouter = Router()

const { APIFLASH_BASE_URL: URL, APIFLASH_API_KEY: access_key } = process.env
if (!URL || !access_key) throw new Error('ADD ENV VARIABLES')

websiteRouter.route('/')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // GET ALL USERS WEBSITES TO DISPLAY ON THE HOME PAGE 
    try {
        const websites = await WebsiteModel.find({ owner: req.user?._id, page: 'home', stage: 'development' })
        res.send(websites)
    } catch (error) {
        next(error)
    }
})
.post(createWebsiteValidation, async (req: IUserRequest, res: Response, next: NextFunction) => {
    // ADD NEW WEBSITE
    // TODO: IF ANY OF THESE STEPES FAIL I SHOULD REMOVE THE PREVIOUS STEPS
    try {
        checkValidationErrors(req)
        const website = await new WebsiteModel({ ...req.body, owner: req.user?._id }).save()
        if (!website) return next(createHttpError(400, 'Website Not Created'))
        const user = await UserModel.findById(req.user?._id)
        user?.websites.push(website._id)
        await user!.save()
        res.status(201).send(website)
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/thumbnail/:websiteName')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // GET THE WEBSITE IMAGE FOR THE THUMBNAIL - ACTING AS PROXY
    try {
        const { websiteName: name } = req.params
        // const url = `https%3A%2F%2Fcode-buddy-vercel.app%2Fws%2F${name}/home`
        // const url = `https%3A%2F%2Fcode-buddy.vercel.app%2Flogin`
        // const { data } = await axios.get(URL, { params: { url, access_key } })
        const fullUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${access_key}&url=https%3A%2F%2Fcode-buddy.vercel.app%2Flogin&response_type=json`
        const { data } = await axios.get(fullUrl)
        res.send(data)
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteName')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // SEND THE LIST OG WEBSITE PAGES FOR CURRENT WEBSITE USER IS EDITING TO DISPLAY IN SIDEBAR
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
    // DELETE A WEBSITE => ALL PAGES FROM DEVELOPMENT & PRODUCTION
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
.put(async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name, websitePage: page } = req.params
        const { title, description } =req.body
        const stages = ['development', 'production']
        stages.map(async stage => await WebsiteModel.findOneAndUpdate({ name, page, stage, owner: req.user?._id }, { title, description }))
        res.send('Updated')
    } catch (error) {
        next(error)
    }
})
.delete(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // DELETE A SPECIFIC WEBSITE PAGE FROM BOTH DEV & PRODUCTION
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

websiteRouter.route('/:websiteName/:websitePage/details')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // SEND THE TITLE AND DESCRIPTION FOR THIS PAGE
    try {
        const { websiteName: name, websitePage: page } = req.params
        const websites = await WebsiteModel.find({ name, page, stage: 'development', owner: req.user?._id }, { title: 1, description: 1, _id: 0 })
        if (websites.length === 0) return next(createHttpError(404, `Couldn't find the website`))
        res.send({ title: websites[0].title, description: websites[0].description })
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteName/:websitePage/update-details')
.put(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // UPDATE THE WEBSITE TITLE AND DESCRIPTION FOR THIS PAGE
    try {
        const { websiteName: name, websitePage: page } = req.params
        const { title, description } = req.body
        const websiteDev = await WebsiteModel.findOneAndUpdate({ name, page, stage: 'development', owner: req.user?._id }, { title, description }, { new: true })
        if (!websiteDev) return next(createHttpError(404, `Couldn't find the website`))
        const websiteProduction = await WebsiteModel.findOneAndUpdate({ name, page, stage: 'production', owner: req.user?._id }, { title, description }, { new: true })
        if (!websiteProduction) return next(createHttpError(404, `Couldn't find the website`))
        res.send(websiteDev)
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteName/:websitePage/:websiteStage')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // GET THE CODE FOR THE DEVELOPMENT STAGE
    try {
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const website = await WebsiteModel.findOne({ name, page, stage: 'development', owner: req.user?._id })
        if (!website) return next(createHttpError(404, 'Website Not Found'))
        res.send(website)
    } catch (error) {
        next(error)
    }
})
.put(saveWebsiteValidation, async (req: IUserRequest, res: Response, next: NextFunction) => {
    // UPDATE THE CODE FOR DEVELOPMENT STAGE
    try {
        checkValidationErrors(req)
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const { code, codeBlocks } =req.body
        const website = await WebsiteModel.findOneAndUpdate({ name, page, stage: 'development', owner: req.user?._id }, { code, codeBlocks })
        if (!website) return next(createHttpError(404, 'Website Not Found'))
        res.send(website)
    } catch (error) {
        next(error)
    }
})

websiteRouter.route('/:websiteName/:websitePage/:websiteStage/code')
.get(async (req: IUserRequest, res: Response, next: NextFunction) => {
    // GET THE WEBSITE CODE FOR THE PREVIEW PAGE OR SEND A CUSTOM 404 MESSAGE
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
    // CREATE OR UPDATE THE PRODUCTIION WEBSITE
    try {
        checkValidationErrors(req)
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params
        const { code } =req.body
        const website = await WebsiteModel.findOneAndUpdate({ name, page, stage: 'production', owner: req.user?._id }, { code })
        if (!website) {
            const newWebsite = new WebsiteModel({ owner: req.user?._id, name, page, stage, code })
            await newWebsite.save()
            res.status(201).send(newWebsite)
        } else { 
            res.send(website)
        }
    } catch (error) {
        next(error)
    }
})

export default websiteRouter