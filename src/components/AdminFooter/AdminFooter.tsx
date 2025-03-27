import React from 'react';
import './AdminFooter.scss';

export interface SupportLink {
    title: string;
    icon: string;
    description: string;
    link: string;
}

const AdminFooter: React.FC = () => {
    const supportLink: SupportLink[] = [
        {
            title: "Get in touch with Support",
            icon: "mail",
            description: "Reach out to the support team for assistance or guidance.",
            link: "https://google.com/",
        },
        {
            title: "Explore Documentation",
            icon: "submission-message",
            description: "Understand the plugin and its settings.",
            link: "https://google.com/",
        },
        {
            title: "Contribute Here",
            icon: "support",
            description: "To participation in product enhancement.",
            link: "https://google.com/",
        },
    ];

    return (
        <div className="support-card">
            {supportLink.map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="card-item">
                    <i className={`admin-font adminLib-${item.icon}`}></i>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                    </a>
                    <p>{item.description}</p>
                </a>
            ))}
        </div>
    );
};

export default AdminFooter;
