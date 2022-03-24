interface ICodeBlock {
    id: string
    name: string
    type: string
    code: IElement[]
}

interface IElement {
    id?: string
    type: string
    name: string
    tag?: string
    className: string
    height?: string
    width?: string
    font?: string
    textSize?: string
    bold?: string
    italics?: string
    underline?: string
    alignment?: string
    color?: string
    bgColor?: string
    marginT?: string
    marginR?: string
    marginB?: string
    marginL?: string
    paddingT?: string
    paddingR?: string
    paddingB?: string
    paddingL?: string
    borderStyle?: string
    borderColor?: string
    borderWidth?: string
    borderRadius?: string
    text?: string
    listStyle?: string
    display?: string
    flexDirection?: string
    flexItems?: string
    flexJustify?: string
    linkTo?: string
    linkType?: string
    hoverBorder?: string
}