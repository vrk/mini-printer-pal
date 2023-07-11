import React from "react";
import styles from './DitherButton.module.css'; // Import css modules stylesheet as styles
import Button from "../Button/Button";

export interface DitherButtonProps {
  label: string;
  ditherStyle?: "atkinson"|"burkes"|"falsefloyd"|"floydsteinberg"|"jarvis"|"sierralite"|"sierra"|"stucki"|"twosierra";
}

const DitherButton = ({
  label,
  ditherStyle = "floydsteinberg"
}: DitherButtonProps) => {
  const imageClassName = `${styles[ditherStyle]} ${styles.icon}`;
  return <div className={styles.component}>
    <div className={imageClassName}></div>
    <Button label={label}></Button>
  </div>
}

export default DitherButton;