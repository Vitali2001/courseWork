import React from "react";
import classNames from "classnames";
import { IInput } from "./types";

const InputComponent: React.FC<IInput> = ({
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
          <option value="">Виберіть вашу діяльність</option>
        <option value="driver">Водій</option>
        <option value="customer">Замовник</option> 
      </select>
      {touched && errors && (
        <div className="invalid-feedback">{errors}</div>
      )}
    </div>
  
  );
};

export default InputComponent;