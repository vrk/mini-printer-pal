import React from "react";
import styles from './NavButton.module.css'; // Import css modules stylesheet as styles

export interface NavButtonProps {
  type: "home"|"help";
}

const NavButton = ({
  type,
}: NavButtonProps) => {
  const style = {
  }
  return <div className={`${styles.component} ${styles[type]}`} style={style}>
  </div>
}

export default NavButton;