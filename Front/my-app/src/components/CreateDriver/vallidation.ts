import * as yup from "yup";

export const Validator = yup.object({

  email: yup.string().required("Поле пошта є обов'язковим!"),
  password: yup.string().required("Поле пароль є обов'язковим!"),
  phone: yup.string().required("Поле телефон є обов'язковим!"),
  image: yup.string().required("Оберіть фото (для вибору фото натисніть на зображення)!"),
  address: yup.string().required("Поле адреса є обов'язковим!"),
  lastName: yup.string().required("Поле прізвище є обов'язковим!"),
  firstName: yup.string().required("Поле ім`я є обов'язковим!"),
  middleName: yup.string().required("Поле по-батькові є обов'язковим!"),
});