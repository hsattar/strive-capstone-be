import { checkSchema } from 'express-validator'

export const createWebsiteValidation = checkSchema({
    name: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'name required'
        }
    },
    page: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'page required'
        }
    },
    stage: { 
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'stage required'
        },
    }
})