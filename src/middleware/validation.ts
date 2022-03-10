import { checkSchema } from 'express-validator'

export const userRegistrationValidation = checkSchema({
    firstName: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'firstName Required'
        }
    },
    lastName: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'lastName Required'
        }
    },
    email: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'email Required'
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'password Required'
        }
    }
})

export const userLoginValidation = checkSchema({
    email: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'email Required'
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'password Required'
        }
    }
})