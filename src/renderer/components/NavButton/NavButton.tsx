import React from "react";
import styles from './NavButton.module.css'; // Import css modules stylesheet as styles

export interface NavButtonProps extends React.ComponentProps<"button"> {
  icon: "home"|"help";
}

const NavButton = ({
  icon,
  ...buttonProps
}: NavButtonProps) => {
  const style = {
  }
  return <button {...buttonProps} className={`${styles.component} ${styles[icon]}`} style={style}></button>
}

export default NavButton;