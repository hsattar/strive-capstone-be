interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    websites: IWebsite[]
    refreshJWT?: string
}