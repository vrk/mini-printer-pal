import React from "react";
import styles from '../../shared/BasicButton.module.css'; 

export interface ButtonProps {
  label: string;
  topBottomPadding?: number;
  leftRightPadding?: number;
  fontSize?: number;
  color?: "yellow"|"pink"
}

const Button = ({
  label,
  topBottomPadding = 6,
  leftRightPadding = 20,
  fontSize = 18,
  color = "yellow"
}: ButtonProps) => {
  const style = {
    fontSize: `${fontSize}px`,
    padding: `${topBottomPadding}px ${leftRightPadding}px`,
  }
  const className = `${styles.button} ${styles[color]}`;
  return <button className={className} style={style}>{label}</button>
}

export default Button;