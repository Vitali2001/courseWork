import * as yup from "yup";

export const Validator = yup.object({


  oldPassword: yup.string()
        .required()
        .min(8,"Пароль має бути не менш ніж 8 символів")
        .max(255)
        .required("Введіть ваш пароль"),
  newPassword: yup.string()
        .required()
        .min(8,"Пароль має бути не менш ніж 8 символів")
        .max(255)
        .required("Вкажіть ваш новий пароль"),
 reNewPassword: yup.string()
        .required()
        .min(8,"Пароль має бути не менш ніж 8 символів")
        .max(255)
        .required("Повторіть новий пароль")


});