import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "@/components/custom/SortableItem";

function BookmarkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setUserEmail(user.email);

      // Loading bookmarks from local storage
      const savedOrder = localStorage.getItem("bookmarksOrder");
      if (savedOrder) {
        setBookmarks(JSON.parse(savedOrder));
        setLoadingBookmarks(false);
      } else {
        loadBookmarks(user.email);
      }
    } else {
      toast("Register or Sign in first to start");
      navigate("/");
    }
  }, []);

  const loadBookmarks = async (email) => {
    setLoadingBookmarks(true);
    try {
      const q = query(collection(db, "Links"), where("userEmail", "==", email));
      const snapshot = await getDocs(q);
      const saved = snapshot.docs.map((doc) => doc.data());
      setBookmarks(saved);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const fetchMetadata = async (targetUrl) => {
    const API_KEY = import.meta.env.VITE_OPEN_GRAPH_API_KEY;
    const OPEN_GRAPH_URL = `https://opengraph.io/api/1.1/site/${encodeURIComponent(
      targetUrl
    )}?app_id=${API_KEY}`;
    const JINA_API_URL = "https://r.jina.ai/";

    try {
      setLoading(true);

      const [ogRes, jinaRes] = await Promise.all([
        fetch(OPEN_GRAPH_URL),
        fetch(`${JINA_API_URL}${targetUrl}`),
      ]);

      const ogData = await ogRes.json();
      let jinaText = await jinaRes.text();

      jinaText = jinaText
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1")
        .replace(/[#*=_>`-]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const summary =
        jinaText.slice(0, 170) + (jinaText.length > 170 ? "..." : "");

      return {
        title: ogData.hybridGraph?.title || "No title",
        favicon: ogData.hybridGraph?.favicon || `${targetUrl}/favicon.ico`,
        link: ogData.hybridGraph?.url || targetUrl,
        summary,
      };
    } catch (error) {
      toast.error("Could not fetch metadata.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = async (bookmark) => {
    try {
      const id = Date.now().toString();
      await setDoc(doc(db, "Links", id), { ...bookmark, userEmail, id });
      return id;
    } catch (error) {
      console.error("Error saving bookmark:", error);
      return null;
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await deleteDoc(doc(db, "Links", id));
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      toast.success("Bookmark deleted");
      // updating localStorage after delete
      const updatedBookmarks = bookmarks.filter((b) => b.id !== id);
      localStorage.setItem("bookmarksOrder", JSON.stringify(updatedBookmarks));
    } catch (error) {
      toast.error("Failed to delete bookmark");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      alert("Enter a valid URL");
      return;
    }

    const bookmark = await fetchMetadata(url.trim());
    if (bookmark) {
      const id = await saveBookmark(bookmark);
      if (id) {
        const newBookmarks = [{ ...bookmark, id, userEmail }, ...bookmarks];
        setBookmarks(newBookmarks);
        // Save updated bookmarks to localStorage
        localStorage.setItem("bookmarksOrder", JSON.stringify(newBookmarks));
      }
      setUrl("");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
      const newIndex = bookmarks.findIndex((b) => b.id === over.id);
      const newOrder = arrayMove(bookmarks, oldIndex, newIndex);
      setBookmarks(newOrder);
      // Save the new order to localStorage
      localStorage.setItem("bookmarksOrder", JSON.stringify(newOrder));
    }
  };

  return (
    <div className="sm:py-5 py-2 px-3 mt-15">
      <div className="max-w-full sm:max-w-xl mx-auto py-14 px-2 sm:p-6 sm:py-5 border border-gray-400 rounded shadow">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="url"
            placeholder="Paste URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 sm:mt-0 sm:ml-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching..." : "Save Bookmark"}
          </button>
        </form>

        {loadingBookmarks ? (
          <ul className="mt-6 space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 p-4 bg-gray-100 rounded"
                >
                  <Skeleton className="w-12 h-12 rounded" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                </li>
              ))}
          </ul>
        ) : bookmarks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={bookmarks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="mt-6 space-y-4">
                {bookmarks.map((b) => (
                  <SortableItem
                    key={b.id}
                    bookmark={b}
                    deleteBookmark={deleteBookmark}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="mt-6 text-center text-gray-500">No bookmarks saved.</p>
        )}
      </div>
    </div>
  );
}

export default BookmarkForm;
