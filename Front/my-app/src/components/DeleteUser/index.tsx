import classNames from "classnames";
import React, { useState } from "react"
import "./style.css";

interface IDeleteUser{
    isClick: boolean
}

const DeleteUser: React.FC<IDeleteUser> = ({isClick}) =>{

    
    const [show, setShow] = useState<boolean>(isClick);
    const toggleModal = () => {
        setShow((prev)=> !prev);

      }
      console.log("show",show)
    return (
      <>
        
  
        <div className={classNames("modal",{"custom-modal": show})}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Редагування фото</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={toggleModal}
                ></button>
              </div>
              <div className="modal-body">
                
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={toggleModal}
                >
                  Скасувать
                </button>
                <button type="button" className="btn btn-primary">
                  Обрати фото
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default DeleteUser;