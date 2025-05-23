import React from "react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col  items-center mx-auto py-40 h-lvh md:mx-56 gap-9">
      <h1 className="font-extrabold text-[30px] md:text-[50px] text-center mt-16">
        <span className="text-blue-600">Link Saver</span> Save your links in one
        place without losing them
      </h1>
      <p className="text-xl text-gray-500 text-center">
        Your personal link saver web application
      </p>
      <Link to={"/bookmark-form"}>
        <Button>Get Started, it's Free</Button>
      </Link>
    </div>
  );
}

export default Hero;
