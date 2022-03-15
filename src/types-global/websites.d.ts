interface ICodeBlock {
    id: string
    name: string
    code: IElement[]
}

interface IElement {
    name: string
    id?: string
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
    backgroundColor?: string
    margin?: string
    padding?: string
    border?: string 
    borderRadius?: string 
    text?: string
}