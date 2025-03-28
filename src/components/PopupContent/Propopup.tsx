/* global appLocalizer */
import React from "react";

import "./popupContent.scss";
import { DialogContent, DialogContentText } from "@mui/material";

interface ProPopupProps {
    proUrl?: string;
}

const ProPopup: React.FC<ProPopupProps> = ({ proUrl }) => {
    // Handle cases where appLocalizer is unavailable
    const safeProUrl = proUrl || (typeof window !== "undefined" && (window as any).appLocalizer?.pro_url) || "#";

    return (
        <DialogContent>
            <DialogContentText>
                <div className="admin-module-dialog-content">
                    <div className="admin-image-overlay">
                        <div className="admin-overlay-content">
                            <h1 className="banner-header">
                                Unlock <span className="banner-pro-tag">Pro</span>
                            </h1>
                            <div className="admin-banner-content">
                                <strong>For pro popup</strong>
                                <p>&nbsp;</p>
                                <p>1. ......</p>
                                <p>2. .....</p>
                            </div>
                            <a className="admin-go-pro-btn" target="_blank" rel="noopener noreferrer" href={safeProUrl}>
                                Upgrade to Pro
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContentText>
        </DialogContent>
    );
};

export default ProPopup;
