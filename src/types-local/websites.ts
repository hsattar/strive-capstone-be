import { Types } from 'mongoose'

export interface IWebsite {
    _id: string
    owner: Types.ObjectId
    name: string
    page: string
    namePage: string
    code: string
    structure: IWebsiteStructure
    createdAt: Date
    updatedAt: Date
}