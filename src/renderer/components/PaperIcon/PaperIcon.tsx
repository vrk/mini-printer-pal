import React from "react";
import styles from './PaperIcon.module.css'; // Import css modules stylesheet as styles

export interface PaperIconProps {
  size: "L"|"M"|"S";
  onClick: () => void;
}

const PaperIcon = ({
  size,
  onClick
}: PaperIconProps) => {
  let width = 40;
  switch (size) {
    case "M":
      width = width * 0.51;
      break;
    case "S":
      width = width * 0.3;
      break;
    case "L":
      break;
  }
  const style = {
    width: `${width}px`
  }
  return <button className={styles.component} style={style} onClick={onClick}></button>
}

export default PaperIcon;