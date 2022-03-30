"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const elementSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    type: String,
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
    bgColor: String,
    marginT: String,
    marginR: String,
    marginB: String,
    marginL: String,
    paddingT: String,
    paddingR: String,
    paddingB: String,
    paddingL: String,
    borderStyle: String,
    borderColor: String,
    borderWidth: String,
    borderRadius: String,
    text: String,
    listStyle: String,
    display: String,
    flexDirection: String,
    flexItems: String,
    flexJustify: String,
    linkTo: String,
    linkType: String,
    hoverBorder: String,
});
const codeBlocksSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    code: [elementSchema]
});
const WebsiteSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    page: { type: String, required: true },
    stage: { type: String, enum: ['development', 'production'], required: true },
    namePageStage: { type: String, default: function () { return `${this.name}${this.page}${this.stage}`; }, unique: true },
    title: { type: String, default: function () { return `${this.name}`; } },
    description: { type: String, default: 'A website created with code buddy.' },
    code: { type: String, default: `` },
    codeBlocks: [codeBlocksSchema],
    images: [String]
}, { timestamps: true });
const WebsiteModel = (0, mongoose_1.model)('Website', WebsiteSchema);
exports.default = WebsiteModel;
