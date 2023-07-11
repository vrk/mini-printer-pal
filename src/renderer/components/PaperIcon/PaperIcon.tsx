import React from "react";
import styles from './PaperIcon.module.css'; // Import css modules stylesheet as styles

export interface PaperIconProps {
  size: "large"|"medium"|"small";
}

const PaperIcon = ({
  size,
}: PaperIconProps) => {
  let width = 40;
  switch (size) {
    case "medium":
      width = 20;
      break;
    case "small":
      width = 15;
      break;
    case "large":
      width = 40;
      break;
  }
  const style = {
    width: `${width}px`
  }
  return <div className={styles.component} style={style}>
  </div>
}

export default PaperIcon;