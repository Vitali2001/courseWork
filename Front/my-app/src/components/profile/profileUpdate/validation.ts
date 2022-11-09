import * as yup from "yup";

export const Validator = yup.object({

  phone: yup.string().min(8,"Поле телефон є обов`язковим"),
  address: yup.string().min(10,"Поле адреса є обов'язковим!"),
  lastName: yup.string().min(2,"Поле прізвище є обов'язковим!"),
  firstName: yup.string().min(2,"Поле ім`я є обов'язковим!"),
  middleName: yup.string().min(2,"Поле по-батькові є обов'язковим!"),
});