import { Model, Document } from 'mongoose'

export type IUserDoc = IUser & Document

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUserDoc | null
}