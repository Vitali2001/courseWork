import * as yup from "yup";
export const LoginSchema = yup.object({
    
    email: yup
        .string()
        .email("Вкажіть праивльно пошту")
        .required("Пошта є обов'язкови полeм"),
    
    password: yup.string()
        .required()
        .min(8,"Пароль має бути не менш ніж 8 символів")
        .max(255)
        .required("Пароль є обов'язкови полeм")
    
});