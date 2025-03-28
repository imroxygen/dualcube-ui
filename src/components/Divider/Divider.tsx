import React from "react";
import { __ } from "@wordpress/i18n";

const Divider: React.FC = () => {
    return (
        <div className="section-divider-container">
            {__("Section Divider", "catalogx")}
        </div>
    );
};

export default Divider;
