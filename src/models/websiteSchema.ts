import { Schema, model } from 'mongoose'
import { IWebsite } from '../types-local/websites'

const containerStructureSchema = new Schema<IContainer>({
    id: { type: String, required: true },
    openingTag: { type: String, required: true },
    class: { type: String, required: true },
    closingTag: { type: String, required: true },
    children: [String]
})

const elementStructureSchema = new Schema<IElement>({
    id: { type: String, required: true },
    openingTag: { type: String, required: true },
    class: { type: String, required: true },
    closingTag: { type: String, required: true },
    height: String,
    width: String,
    font: String,
    fontSize: String,
    bold: String,
    italics: String,
    underline: String,
    alignment: String,
    color: String,
    backgroundColor: String,
    margin: String,
    padding: String,
    border: String,
    borderRadius: String,
    text: String,
})

const WebsiteStructureSchema = new Schema<IWebsiteStructure>({
    containers: [containerStructureSchema],
    elements: [elementStructureSchema],
    containerOrder: [{ type: String, default: `123456789` }]
})

const WebsiteSchema = new Schema<IWebsite>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    page: { type: String, required: true },
    stage: { type: String, enum: ['development', 'production'], required: true },
    namePageStage: { type: String, default: function() { return `${this.name}${this.page}${this.stage}` }, unique: true },
    code: { type: String, default: `<div class="123456789"></div>` },
    structure: WebsiteStructureSchema
}, { timestamps: true })

const WebsiteModel = model<IWebsite>('Website', WebsiteSchema)
export default WebsiteModel