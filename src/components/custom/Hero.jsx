import React from "react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col  items-center mx-auto py-40 h-lvh md:mx-56 gap-9">
      <h1 className="font-extrabold text-[30px] md:text-[50px] text-center mt-16">
        <span className="text-blue-500">Your Smart Bookmark Manager</span>
        <br />
        <span className="text-[25px] md:text-[40px]">
          {" "}
          Auto-fetch titles, favicons, and generate summaries — all in one
          click.
        </span>
      </h1>
      <p className="text-xl text-gray-500 text-center">
        Paste any URL, and let us do the rest — from fetching the title to
        generating a summary.
      </p>
      <Link to={"/bookmark-form"}>
        <Button>Get Started, it's Free</Button>
      </Link>
    </div>
  );
}

export default Hero;
