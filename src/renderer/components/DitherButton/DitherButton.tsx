import React from "react";
import styles from './DitherButton.module.css'; // Import css modules stylesheet as styles
import Button from "../Button/Button";

export interface DitherButtonProps {
  label: string;
  highlighted: boolean;
  ditherStyle?: "atkinson"|"burkes"|"floyd"|"jarvis"|"sierra2"|"diff2d"|"stucki"|"sierra2"|"diffrow"|"diffcol"|"threshold";
  onClick?: () => void;
}

const DitherButton = ({
  label,
  ditherStyle = "floyd",
  highlighted,
  onClick
}: DitherButtonProps) => {
  const imageClassName = `${styles[ditherStyle]} ${styles.icon}`;
  return <div className={`${styles.component} ${highlighted ? styles.highlighted : ""}`}>
    <div className={imageClassName}></div>
    <Button label={label} width={90} onClick={onClick}></Button>
  </div>
}

export default DitherButton;