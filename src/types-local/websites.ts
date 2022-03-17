import { Types } from 'mongoose'

export interface IWebsite {
    _id: string
    owner: Types.ObjectId
    name: string
    page: string
    stage: 'devlopment' | 'production'
    namePageStage: string
    code: string
    codeBlocks: ICodeBlock
    images: string[]
    createdAt: Date
    updatedAt: Date
}