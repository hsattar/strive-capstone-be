import { Model, Document } from 'mongoose'
import { Request } from 'express'

export type IUserDoc = IUser & Document

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUserDoc | null
}

export interface IUserRequest extends Request {
    user?: IPayload
}