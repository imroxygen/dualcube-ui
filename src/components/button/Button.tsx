import React from "react";
import "./Button.scss";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button className="front joybtn" onClick={onClick}>{label}</button>;
};

export default Button;