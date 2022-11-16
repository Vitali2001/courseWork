import React, { LegacyRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import "./style.css";
import { ICropperDialog } from "./types";


const CropperDialog: React.FC<ICropperDialog> = ({
  onChange,
  field,
  error,
  touched,
  value,
  aspectRation=1/1,
  currentImg = "http://cdn.onlinewebfonts.com/svg/img_391162.png"
}) => {
 const [currentImage, setCurrentImage] = useState<string>(
  currentImg
  ); 
  const [show, setShow] = useState<boolean>(false);

  const [uploadedImageType, setUploadedImageType] = useState<string>("image/jpeg");
  const [image, setImage] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(); //посилання на тег img в модалці
  const imgPrevRef = useRef<HTMLImageElement>(); //попередній перегляд фото
  const [cropperObj, setCropperObj] = useState<Cropper>();

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = (e.target.files as FileList);
    if (files && files.length) {
      const file = files[0];
      if (/^image\/\w+/.test(file.type)) {
        const fileType=file.type;
        if(fileType==='image/png')
          setUploadedImageType(file.type);
        else
          setUploadedImageType('image/jpeg');
        const url = URL.createObjectURL(file);
        await setShow((prev)=> !prev);
        await setImage(url);
        cropperObj?.replace(url);
      } else {
        window.alert("Оберіть файл зображення.");
      }
    }

    e.target.value=""; //обнуляємо значення
  }

  const toggleModal = () => {
    setShow((prev)=> !prev);
  }

  useEffect(() => {
    if(imgRef.current)
    {
        const cropper = new Cropper(imgRef.current as HTMLImageElement, {
            viewMode: 1,
            aspectRatio: aspectRation,
            preview: imgPrevRef.current
        });
        setCropperObj(cropper);
    }
  },[aspectRation]);

  const handleCroppedImage = () => {
    const base64 = cropperObj?.getCroppedCanvas().toDataURL(uploadedImageType) as string;
    //console.log("base64", base64);
    setCurrentImage(base64);
    toggleModal();
    onChange(field, base64);
  }

  return (
    <>
      <label htmlFor="image">
        <img
          src={currentImage}
          style={{ cursor: "pointer" }}
          width="150"
          alt="Оберіть фото"
        />
      </label>
      <input type="file" 
        className="d-none" 
        id="image" 
        accept="image/*"
        onChange={handleSelectImage}
        />

    {error && touched && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className={classNames("modal", {"custom-modal": show})}>
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
              <div className="row">
                <div className="col-md-8 col-lg-9">
                    <div className="d-flex justify-content-center">
                        <img src={image} 
                            alt="Вибрана фотка" 
                            width="100%"
                            ref={imgRef as LegacyRef<HTMLImageElement>}
                            />
                    </div>
                </div>
                <div className="col-md-4 col-lg-3">
                    <div className="d-flex justify-content-center">
                        <div
                            ref={imgPrevRef as LegacyRef<HTMLImageElement>}
                            style={{
                                height: "150px",
                                width: "150px",
                                border: "1px solid silver",
                                overflow: "hidden"
                            }}>

                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={toggleModal}
              >
                Скасувати
              </button>
              <button type="button" className="btn btn-primary" onClick={handleCroppedImage}>
                Обрати фото
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CropperDialog;
