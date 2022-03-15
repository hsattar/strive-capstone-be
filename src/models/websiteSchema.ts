import { Schema, model } from 'mongoose'
import { IWebsite } from '../types-local/websites'

const elementSchema = new Schema<IElement>({
    id: { type: String, required: true },
    name: String,
    tag: String,
    className: String,
    height: String,
    width: String,
    font: String,
    textSize: String,
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

const codeBlocksSchema = new Schema<ICodeBlock>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    code: [elementSchema]
})

const WebsiteSchema = new Schema<IWebsite>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    page: { type: String, required: true },
    stage: { type: String, enum: ['development', 'production'], required: true },
    namePageStage: { type: String, default: function() { return `${this.name}${this.page}${this.stage}` }, unique: true },
    code: { type: String, default: `` },
    codeBlocks: codeBlocksSchema
}, { timestamps: true })

const WebsiteModel = model<IWebsite>('Website', WebsiteSchema)
export default WebsiteModel