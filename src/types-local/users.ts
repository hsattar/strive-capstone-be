import { Model } from 'mongoose'

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
}