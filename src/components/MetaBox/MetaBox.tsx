import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

interface FormField {
  type: string;
  name: string;
  placeholder?: string;
  charlimit?: number;
  row?: number;
  column?: number;
  sitekey?: string;
  filesize?: number;
  required?: boolean;
  disabled?: boolean;
}

interface InputType {
  value: string;
  label: string;
}

interface SettingMetaBoxProps {
  formField: FormField;
  inputTypeList: InputType[];
  onChange: (field: keyof FormField, value: any) => void;
  onTypeChange: (value: string) => void;
  opened: { click: boolean };
}

const FormFieldSelect: React.FC<{
  inputTypeList: InputType[];
  formField: FormField;
  onTypeChange: (value: string) => void;
}> = ({ inputTypeList, formField, onTypeChange }) => (
  <FieldWrapper label="Type">
    <select
      onChange={(event) => onTypeChange?.(event.target.value)}
      value={formField.type}
    >
      {inputTypeList.map((inputType) => (
        <option key={inputType.value} value={inputType.value}>
          {inputType.label}
        </option>
      ))}
    </select>
  </FieldWrapper>
);

const FieldWrapper: React.FC<{
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, children, className }) => (
  <article className={`modal-content-section-field ${className || ""}`} onClick={(e) => e.stopPropagation()}>
    <p>{label}</p>
    {children}
  </article>
);

const InputField: React.FC<{
  label: string;
  type?: string;
  value: any;
  onChange: (value: string) => void;
  className?: string;
}> = ({ label, type = "text", value, onChange, className }) => (
  <FieldWrapper label={label} className={className}>
    <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} />
  </FieldWrapper>
);

const SettingMetaBox: React.FC<SettingMetaBoxProps> = ({ formField, inputTypeList, onChange, onTypeChange, opened }) => {
  const [hasOpened, setHasOpened] = useState(opened.click);
  const modalRef = useRef<HTMLDivElement>(null);

  const isValidSiteKey = (key: string) => /^6[0-9A-Za-z_-]{39}$/.test(key);
  const [isSiteKeyEmpty, setIsSiteKeyEmpty] = useState(formField.type === "recaptcha" && !isValidSiteKey(formField.sitekey || ""));

  useEffect(() => {
    if (formField.type === "recaptcha") {
      onChange("disabled", isSiteKeyEmpty);
    }
  }, [isSiteKeyEmpty]);

  useEffect(() => {
    setHasOpened(opened.click);
  }, [opened]);

  return (
    <div onClick={() => setHasOpened((prevState) => !prevState)}>
      <i className="admin-font adminLib-menu"></i>
      {hasOpened && (
        <Draggable nodeRef={modalRef as unknown as React.RefObject<HTMLElement>}>
          <section ref={modalRef} className="meta-setting-modal">
            <button
              className="meta-setting-modal-button"
              onClick={(event) => {
                event.stopPropagation();
                setHasOpened(false);
              }}
            >
              <i className="admin-font adminLib-cross"></i>
            </button>
            <main className="meta-setting-modal-content">
              <h3>Input Field Settings</h3>
              <div className="setting-modal-content-section">
                <FormFieldSelect inputTypeList={inputTypeList} formField={formField} onTypeChange={onTypeChange} />
                <InputField label="Name" value={formField.name} onChange={(value) => onChange("name", value)} />
              </div>
            </main>
          </section>
        </Draggable>
      )}
    </div>
  );
};

export default SettingMetaBox;
