// region imports
import React from "react";
// endregion

// region component
const Footer = () => {
  return (
    <footer className='bg-light text-center text-muted py-3 mt-auto border-top small'>
      &copy; {new Date().getFullYear()} Employee Management. All rights
      reserved.
    </footer>
  );
};
// endregion

// region exports
export default Footer;
// endregion
