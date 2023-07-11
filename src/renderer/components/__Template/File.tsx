import React from "react";
import styles from './File.module.css'; // Import css modules stylesheet as styles

export interface FileProps {
  label: string;
}

const File = ({
  label,
}: FileProps) => {
  const style = {
  }
  return <div className={styles.component} style={style}>
  </div>
}

export default File;