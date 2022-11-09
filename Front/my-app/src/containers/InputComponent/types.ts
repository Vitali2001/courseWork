import React from "react";

export interface IInput {
    inputName?: string,
    title?: string,
    errors?: string,
    touched?: boolean,
    handleChange:(e: React.ChangeEvent<any>)=>void,
    defaultVal?: string
}