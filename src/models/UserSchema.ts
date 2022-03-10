import { Schema, model } from 'mongoose'
import { IUserModel } from '../types-local/users'
import bcrypt from 'bcrypt'

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, default: function() { return `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`} },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    websites: [{ type: Schema.Types.ObjectId, ref: 'Website' }],
    refreshToken: String
})

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 11)
        this.password = hashedPassword
    }
    next()
})

UserSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.__v
    delete userObject.password
    delete userObject.refreshToken
    return userObject
}

UserSchema.statics.authenticate = async function (email, plainPassword) {
    const user = await this.findOne({ email })
    if (!user) return null
    const passwordsMatch = await bcrypt.compare(plainPassword, user.password)
    if (!passwordsMatch) return null
    return user
}

const UserModel = model<IUser, IUserModel>('User', UserSchema)
export default UserModel