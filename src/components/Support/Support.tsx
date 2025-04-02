import React, { useState } from "react";
import "./support.scss";

const Support = () => {
  const url = "https://www.youtube.com/embed/cgfeZH5z2dM?si=3zjG13RDOSiX2m1b";

  const [faqs, setFaqs] = useState([
    {
      question:
        "Why am I not receiving any emails when a customer subscribes for an out-of-stock product?",
      answer:
        "Please install a plugin like Email Log and perform a test subscription.",
      open: true,
    },
    {
      question: "Why is the out-of-stock form not appearing?",
      answer:
        "There might be a theme conflict issue. To troubleshoot, switch to a default theme like Twenty Twenty-Four and check if the form appears.",
      open: false,
    },
  ]);

  const toggleFAQ = (index:number) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq, i) => ({
        ...faq,
        open: i === index ? !faq.open : false,
      }))
    );
  };

  return (
    <div className="dynamic-fields-wrapper">
      <div className="support-container">
        <div className="support-header-wrapper">
          <h1 className="support-heading">Thank you for [plugin name]</h1>
          <p className="support-subheading">Plugin support subheading</p>
        </div>
        <div className="video-faq-wrapper">
          <div className="video-section">
            <iframe
              src={url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="faq-section">
            <div className="faqs">
              {faqs.map((faq, index) => (
                <div
                  className={`faq ${faq.open ? "open" : ""}`}
                  key={index}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-question">{faq.question}</div>
                  <div
                    className="faq-answer"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
