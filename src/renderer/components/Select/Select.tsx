import React from "react";
import styles from './Select.module.css'; // Import css modules stylesheet as styles

export interface SelectProps {
  ref?: React.RefObject<HTMLSelectElement>;
}

const Select = ({ children, ref }: React.PropsWithChildren<SelectProps>) => {
  const style = {
  }
  return <select className={styles.component} style={style} ref={ref}>
    {children}
  </select>
}

export default Select;