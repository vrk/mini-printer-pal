import React from "react";
import styles from './TextBox.module.css'; // Import css modules stylesheet as styles

export interface TextBoxProps extends React.ComponentProps<"input"> { }

const TextBoxProps = ({
  ...inputProps
}: TextBoxProps) => {
  return <input {...inputProps} type="text" className={styles.component} />;
}

export default TextBoxProps;