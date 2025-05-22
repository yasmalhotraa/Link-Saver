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

function BookmarkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setUserEmail(user.email);
      loadBookmarks(user.email);
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
    const API_KEY = "55e86184-6fde-46b7-bd15-d8e6a9b9e73a";
    const apiUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(
      targetUrl
    )}?app_id=${API_KEY}`;

    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();
      setLoading(false);

      return {
        title: data.hybridGraph?.title || "No title",
        favicon: data.hybridGraph?.favicon || `${targetUrl}/favicon.ico`,
        link: data.hybridGraph?.url || targetUrl,
      };
    } catch (error) {
      setLoading(false);
      alert("Could not fetch metadata.");
      return null;
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
    } catch (error) {
      console.error("Error deleting bookmark:", error);
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
        setBookmarks((prev) => [...prev, { ...bookmark, id, userEmail }]);
      }
      setUrl("");
    }
  };

  return (
    <div className="max-w-full sm:max-w-xl mx-auto mt-18 p-4 sm:p-6 border rounded shadow">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          placeholder="Paste URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <ul className="mt-6 space-y-4">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-100 rounded hover:shadow dark:bg-black"
            >
              <div>
                <div>
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 w-full text-black dark:text-white no-underline"
                  >
                    <img
                      src={b.favicon}
                      alt="favicon"
                      className="w-10 h-10 dark:bg-white p-1 sm:w-12 sm:h-12 rounded object-contain"
                    />
                    <h3 className="text-base sm:text-lg font-semibold break-words">
                      {b.title}
                    </h3>
                  </a>
                </div>
                <div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
                    vero odio rem, ut consequatur sequi quas numquam
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  aria-label={`Delete bookmark ${b.title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-center text-gray-500">No bookmarks Saved.</p>
      )}
    </div>
  );
}

export default BookmarkForm;
