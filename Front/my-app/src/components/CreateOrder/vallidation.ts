import * as yup from "yup";

export const Validator = yup.object({

  fromRegion: yup.string().required("Поле звідки(область) є обов`язковим!"), 
  toRegion: yup.string().required("Поле куди(область) є обов`язковим!"),  
  fromCity: yup.string().required("Поле звідки(місто/населений пункт) є обов'язковим!"),
  fromAddress: yup.string().required("Поле звідки(адреса) є обов'язковим!"),
  toCity: yup.string().required("Поле куди(місто/населений пункт) є обов'язковим!"),
  image: yup.string().required("Оберіть фото (для вибору фото натисніть на зображення)!"),
  toAddress: yup.string().required("Поле куди(адреса) є обов'язковим!"),
  weight: yup.string().required("Поле вага/об`єм є обов'язковим!"),
  price: yup.string().required("Поле ціна є обов'язковим!")
});