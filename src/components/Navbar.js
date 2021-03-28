import React from "react";

import { Button } from "react-bootstrap";
function Navbar() {
  return (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <Button className = "px-5 mx-5" variant="info">1.Tur</Button>
      <Button  className = "px-5  mx-5"variant="info">2.Tur</Button>
      <Button className = "px-5  mx-5"variant="info">3.Tur</Button>
      <Button className = "px-5 mx-5"variant="secondary">Final</Button>
    </div>
  );
}

export default Navbar;
