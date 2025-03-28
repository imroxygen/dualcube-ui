/* global appLocalizer */
import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { __, sprintf } from "@wordpress/i18n";
import "./popupContent.scss";

interface ModulePopupProps {
    name?: string;
    settings?: string;
    plugin?: string;
}

const ModulePopup: React.FC<ModulePopupProps> = ({ name, settings, plugin }) => {
    // Handle cases where appLocalizer is unavailable
    const modulePageUrl =
        typeof window !== "undefined" && (window as any).appLocalizer?.module_page_url
            ? (window as any).appLocalizer.module_page_url
            : "#";

    return (
        <DialogContent>
            <DialogContentText>
                <div className="admin-module-dialog-content">
                    <div className="admin-image-overlay">
                        <div className="admin-overlay-content">
                            <div className="admin-banner-content">
                                {name && (
                                    <>
                                        <h2>
                                            {sprintf(
                                                __("To activate please enable the %s module first", "catalogx"),
                                                name
                                            )}
                                        </h2>
                                        <a className="admin-go-pro-btn" href={modulePageUrl}>
                                            {__("Enable Now", "catalogx")}
                                        </a>
                                    </>
                                )}
                            </div>

                            {settings && (
                                <>
                                    <h2>{__("Activate Sitewide Buy Mode", "catalogx")}</h2>
                                    <p id="description">
                                        {__(
                                            "The \"Sitewide Buy Mode\" is required to unlock purchase functionality across the site. Make sure it's activated to proceed.",
                                            "catalogx"
                                        )}
                                    </p>
                                </>
                            )}

                            {plugin === "notifima" && (
                                <div>
                                    <h2>{__('Download and install "Notifima"', "catalogx")}</h2>
                                    <p id="description">
                                        {__(
                                            '"Notifima" is a necessary product to enable notifications and other related settings. Download and install it to complete the setup.',
                                            "catalogx"
                                        )}
                                    </p>
                                    <a
                                        className="admin-go-pro-btn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://wordpress.org/plugins/woocommerce-product-stock-alert/"
                                    >
                                        {__("Download now", "catalogx")}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContentText>
        </DialogContent>
    );
};

export default ModulePopup;
