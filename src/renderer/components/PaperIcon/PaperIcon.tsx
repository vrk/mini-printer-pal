import React from "react";
import styles from './PaperIcon.module.css'; // Import css modules stylesheet as styles

export interface PaperIconProps {
  size: "large"|"medium"|"small";
  onClick: () => void;
}

const PaperIcon = ({
  size,
  onClick
}: PaperIconProps) => {
  let width = 40;
  switch (size) {
    case "medium":
      width = width * 0.51;
      break;
    case "small":
      width = width * 0.3;
      break;
    case "large":
      break;
  }
  const style = {
    width: `${width}px`
  }
  return <button className={styles.component} style={style} onClick={onClick}></button>
}

export default PaperIcon;