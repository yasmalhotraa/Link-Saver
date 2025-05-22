import React from "react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
function Hero() {
  return (
    <div className="flex flex-col items-center mx-56  max-600:mx-5 gap-9">
      <h1 className="font-extrabold text-[50px] max-600:text-[30px] text-center mt-16">
        <span className="text-blue-500">Link Saver</span> Save your links in one
        place without losing them
      </h1>
      <p className="text-xl text-gray-500 text-center">
        Your personal link saver web application
      </p>
      <Link to={"/link-saver"}>
        <Button>Get Started, it's Free</Button>
      </Link>
    </div>
  );
}

export default Hero;
