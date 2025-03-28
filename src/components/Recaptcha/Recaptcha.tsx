import { __ } from "@wordpress/i18n";
import React from "react";

interface RecaptchaProps {
    formField: { sitekey?: string };
    onChange?: (field: string, value: any) => void;
}

const Recaptcha: React.FC<RecaptchaProps> = ({ formField }) => {
    return (
        <div className={`main-input-wrapper ${!formField.sitekey ? "recaptcha" : ""}`}>
            <p>{__("reCAPTCHA has been successfully added to the form.", "catalogx")}</p>
        </div>
    );
};

export default Recaptcha;
