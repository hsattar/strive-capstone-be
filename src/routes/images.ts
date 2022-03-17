import { NextFunction, Response, Router } from 'express'
import createHttpError from 'http-errors'
import { IUserRequest } from '../types-local/users'
import { parser } from '../utils/cloudinary'
import axios from 'axios'
import WebsiteModel from '../models/websiteSchema'

const imageRouter = Router()

const { UNSPLASH_BASE_URL: URL, UNSPLASH_API_KEY: client_id } = process.env
if (!URL || !client_id) throw new Error('ADD ENV VARIABLES')

imageRouter.post('/:websiteName/upload-image', parser.single('image'),  async (req: IUserRequest, res: Response, next: NextFunction) => {
    // IMAGE UPLOAD TO CLOUDINARY
    try {
        const { websiteName: name } = req.params
        if (!req.file?.path) return next(createHttpError(400, 'File Not Uploaded'))
        const website = await WebsiteModel.findOneAndUpdate({ name, page: 'home', stage: 'development' }, { $push: { images: req.file.path } })
        console.log(website)
        if (!website) return next(createHttpError(404, 'Website Not Found'))
        res.status(201).send(req.file.path)
    } catch (error) {
        next(error)
    }
})

imageRouter.get('/:websiteName/images', async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        // SEND THE IMAGES UPLOADED FOR THE WEBSITE
        const { websiteName: name } = req.params
        const websiteImages = await WebsiteModel.findOne({ name, page: 'home', stage: 'development' }, { images: 1, _id: 0 })
        if (!websiteImages) return next(createHttpError(404, 'No Website Images Found'))
        res.send(websiteImages.images)
    } catch (error) {
        next(error)
    }
})

imageRouter.get('/unsplash/:query/:page/:per_page', async (req: IUserRequest, res: Response, next: NextFunction) => {
    // PROXY ROUTE TO HIDE API KEY
    try {
        const { query, page, per_page } = req.params
        const { data } = await axios.get(URL, { params: { query, page, per_page, client_id } })
        res.send(data)
    } catch (error) {
        next(error)
    }
})

export default imageRouter