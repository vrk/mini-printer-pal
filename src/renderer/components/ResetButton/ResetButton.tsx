import React from "react";
import styles from './ResetButton.module.css'; // Import css modules stylesheet as styles

export interface ResetButtonProps extends React.ComponentProps<"button"> {
}

const ResetButton = ({
  ...buttonProps
}: ResetButtonProps) => {
  const style = {
  }
  return <button {...buttonProps} className={styles.component} style={style}></button>
}

export default ResetButton;