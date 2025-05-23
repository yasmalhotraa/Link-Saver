import React, { useEffect, useState } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./components/custom/Header";
import BookmarkForm from "./pages/BookmarkForm";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "bookmark-form",
    element: <BookmarkForm />,
  },
]);

function Root() {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <StrictMode>
      {/* Global wrapper for background */}
      <div className="min-h-screen w-full max-w-screen bg-[#fffef4]  dark:bg-stone-800 text-black dark:text-zinc-100 transition-colors duration-300">
        {/* Dark mode toggle */}
        <div className="absolute items-center gap-2 flex top-18 right-4 z-50">
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-black dark:bg-white dark:hover:bg-gray-300 md:text-[17px] text-sm hover:bg-gray-600   px-3 py-1 rounded"
          >
            {darkMode ? "☀️" : "🌙"}
          </Button>
        </div>

        <Header />
        <Toaster />
        <RouterProvider router={router} />
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
