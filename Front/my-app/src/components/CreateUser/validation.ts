import * as yup from "yup";

export const Validator = yup.object({

  email: yup.string().required("Поле пошта є обов'язковим!"),
  password: yup.string().required("Поле пароль є обов'язковим!"),
  phone: yup.string().required("Поле телефон є обов'язковим!"),
  image: yup.string().required("Оберіть фото (для вибору фото натисніть на зображення)!"),
  age: yup.string().required("Поле вік є обов'язковим!"),
});