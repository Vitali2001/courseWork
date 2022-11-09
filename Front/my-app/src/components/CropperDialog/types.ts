export interface ICropperDialog {
    onChange: (field: string, value: string) => void,
    field: string,
    value?: string,
    error?: string,
    touched?: boolean,
    aspectRation?: number,
    currentImg?: string
}