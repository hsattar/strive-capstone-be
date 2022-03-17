interface ICodeBlock {
    id: string
    name: string
    code: IElement[]
}

interface IElement {
    id?: string
    name: string
    tag: string
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
    border?: string 
    borderRadius?: string 
    text?: string
    listStyle?: string
    hoverBorder?: string
}