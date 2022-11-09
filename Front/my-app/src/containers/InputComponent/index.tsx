import React from "react";
import classNames from "classnames";
import { IInput } from "./types";

const SelectComponent: React.FC<IInput> = ({
  inputName,
  title,
  errors,
  touched,
  handleChange,
  defaultVal
}) => {
 
    return (
    <div className="mb-3">
      <label htmlFor={inputName} className="form-label">
      {title}
      </label>
      <input
        type= {inputName}
        className={classNames(
          "form-control",
          { "is-invalid": touched && errors },
          { "is-valid": touched && !errors }
        )}
        name={inputName}
        id={inputName}
        onChange={handleChange}
        defaultValue={defaultVal}
      />
      {touched && errors && (
        <div className="invalid-feedback">{errors}</div>
      )}
    </div>
  
  );
};

export default SelectComponent;