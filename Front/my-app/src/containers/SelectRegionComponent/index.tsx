import React from "react";
import classNames from "classnames";
import { IInput } from "./types";

const SelectRegionComponent: React.FC<IInput> = ({
  inputName,
  title,
  errors,
  touched,
  handleChange,
}) => {
    return (
    <div className="mb-3">
      <label htmlFor={inputName} className="form-label">
      {title}
      </label>
      <select className={classNames(
          "form-select",
          { "is-invalid": touched && errors },
          { "is-valid": touched && !errors }
        )} 
        name={inputName}
        id={inputName}
        onChange={handleChange}>
          <option value="">Виберіть область</option>
        <option value="Автономна республіка Крим">Автономна республіка Крим</option>
        <option value="Вінницька обл.">Вінницька</option> 
        <option value="Волинська обл.">Волинська</option>
        <option value="Дніпропетровська обл.">Дніпропетровська</option> 
        <option value="Донецька обл.">Донецька</option> 
        <option value="Житомирська обл.">Житомирська</option>
        <option value="Закарпатська обл.">Закарпатська</option>
        <option value="Запорізька обл.">Запорізька</option> 
        <option value="Івано-Франківська обл.">Івано-Франківська</option>
        <option value="Київська обл.">Київська</option> 
        <option value="Кіровоградська обл.">Кіровоградська</option> 
        <option value="Луганська обл.">Луганська</option>
        <option value="Львівська обл.">Львівська</option>
        <option value="Миколаївська обл.">Миколаївська</option> 
        <option value="Одеська обл.">Одеська</option>
        <option value="Полтавська обл.">Полтавська</option> 
        <option value="Рівненська обл.">Рівненська</option> 
        <option value="Сумська обл.">Сумська</option>
        <option value="Тернопільска обл.">Тернопільска</option>
        <option value="Харківська обл.">Харківська</option> 
        <option value="Херсонська обл.">Херсонська</option>
        <option value="Хмельницька обл.">Хмельницька</option> 
        <option value="Черкаська обл.">Черкаська</option> 
        <option value="Чернівецька обл.">Чернівецька</option>
        <option value="Чернігівська обл.">Чернігівська</option>
      </select>
      {touched && errors && (
        <div className="invalid-feedback">{errors}</div>
      )}
    </div>
  
  );
};

export default SelectRegionComponent;