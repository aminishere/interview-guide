import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Interview App</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/interviewee" className="hover:underline">Interviewee</Link>
        <Link to="/interviewer" className="hover:underline">Interviewer</Link>
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };
