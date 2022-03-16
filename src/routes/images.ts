import { NextFunction, Response, Router } from 'express'
import createHttpError from 'http-errors'
import { IUserRequest } from '../types-local/users'
import { parser } from '../utils/cloudinary'
import axios from 'axios'

const imageRouter = Router()

const { UNSPLASH_BASE_URL: URL, UNSPLASH_API_KEY: client_id } = process.env
if (!URL || !client_id) throw new Error('ADD ENV VARIABLES')

imageRouter.post('/upload-image', parser.single('image'),  async (req: IUserRequest, res: Response, next: NextFunction) => {
    // IMAGE UPLOAD TO CLOUDINARY
    try {
        if (!req.file?.path) return next(createHttpError(400, 'File Not Uploaded'))
        res.status(201).send(req.file.path)
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