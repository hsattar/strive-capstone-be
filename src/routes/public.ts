import { NextFunction, Request, Response, Router } from 'express'
import WebsiteModel from '../models/websiteSchema'

const publicRouter = Router()

publicRouter.route('/:websiteName/:websitePage/:websiteStage/code')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { websiteName: name, websitePage: page } = req.params
        const website = await WebsiteModel.findOne({ name, page, stage: 'production' }, { code: 1, _id: 0 })
        if (!website) return res.send('<div class="flex justify-center"><h2 class="mt-12 text-3xl">Website Does Not Exist</h2></div>')
        res.send(website.code)
    } catch (error) {
        next(error)
    }
})

export default publicRouter