import { Schema, model } from 'mongoose'
import { IWebsite } from '../types-local/websites'

const WebsiteStructureSchema = new Schema<IWebsiteStructure>({
    containers: [],
    elements: [],
    containerOrder: []
})

const WebsiteSchema = new Schema<IWebsite>({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    page: { type: String, required: true },
    namePage: { type: String, default: function() { return `${this.name}${this.page}` }, unique: true },
    code: { type: String, required: true },
    structure: WebsiteStructureSchema
}, { timestamps: true })

const WebsiteModel = model<IWebsite>('Website', WebsiteSchema)
export default WebsiteModel