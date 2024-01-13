import React from "react";
import styles from './Navigation.module.css';

interface NavbarLinks {
  Create: string;
  onClick: () => void; // Define the type for the onClick prop
}

const Navigation: React.FC<NavbarLinks> = (props) => {
  return (
    <div className={styles.navbar}>
      {/* here would come the navigation bar */}
      <button className={styles.createButton} onClick={props.onClick}>
        {props.Create}
      </button>
    </div>
  );
}

export default Navigation;