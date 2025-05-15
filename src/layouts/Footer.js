import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const ourYear = new Date().getFullYear();
  return (
    <div className="main-footer">
      <span>&copy; {ourYear}. Twitter24 Admin. All Rights Reserved.</span>
      <span>Developed by: <b>Athreya</b></span>
    </div>
  )
}