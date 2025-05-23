import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDragMove2Fill } from "react-icons/ri";

export default function SortableItem({ bookmark, deleteBookmark }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: bookmark.id, handle: true });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#f3eadf] rounded hover:shadow dark:bg-stone-900"
    >
      {/* Drag Icon */}
      <div
        {...listeners}
        className="absolute top-2 right-4 cursor-move w-8 h-8 flex justify-center items-center select-none rounded bg-[#fffef4] dark:bg-stone-700  dark:hover:bg-stone-600"
      >
        <RiDragMove2Fill className="text-xl" />
      </div>

      <div className="flex-grow pr-10">
        {" "}
        <a
          href={bookmark.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 w-full text-black dark:text-white no-underline"
        >
          <img
            src={bookmark.favicon || "/placeholder-favicon.png"}
            alt="favicon"
            className="w-10 h-10 p-1 dark:bg-white sm:w-12 sm:h-12 rounded object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-favicon.png";
            }}
          />
          <h3 className="text-base sm:text-lg font-semibold break-words">
            {bookmark.title}
          </h3>
        </a>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
          {bookmark.summary || "No summary available."}
        </p>
      </div>

      <div>
        <button
          onClick={() => deleteBookmark(bookmark.id)}
          className="mt-2 sm:mt-0 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
