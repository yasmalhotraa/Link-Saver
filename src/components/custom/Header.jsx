import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  deleteUser,
} from "firebase/auth";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomConfirmationModal from "./CustomConfirmationModal";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

function Header() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.clear();
      toast("Logged out successfully!");
      setUser(null);
      window.location.reload();
    } catch (error) {
      toast(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast("No user is logged in.");
        return;
      }

      //Deleting all data associated to the user
      const q = query(
        collection(db, "Links"),
        where("userEmail", "==", currentUser.email)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "Links", docSnap.id))
      );
      await Promise.all(deletePromises);

      //Deleting user from firebase Auth
      await deleteUser(currentUser);

      //Clearing local Storage and reloading
      localStorage.clear();
      setUser(null);

      toast("Account and all associated data deleted successfully.");
      window.location.reload();
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        toast(
          "Please re-authenticate to delete your account. Log out and log back in to try again."
        );
      } else {
        toast(`Error deleting account: ${error.message}`);
      }
    }
  };

  const toggleLoginForm = () => {
    setShowLoginForm((prevState) => {
      const newState = !prevState;
      document.body.style.overflow = newState ? "hidden" : "auto";
      return newState;
    });
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm((prevState) => {
      const newState = !prevState;
      document.body.style.overflow = newState ? "hidden" : "auto";
      return newState;
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-3 shadow-md flex justify-between items-center px-5 bg-[#f3eadf] dark:bg-stone-900">
      <a href="/">
        <div className="flex gap-1 font-extrabold justify-center items-center">
          <h1 className="md:text-2xl text-l">BookmarkBuddy</h1>
        </div>
      </a>

      <div className="relative flex gap-2 items-center">
        {user ? (
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger className="p-0 rounded-full">
                <img
                  src={user?.photoURL || "/placeholder-avatar.png"}
                  className="w-[35px] h-[35px] rounded-full"
                  alt="User Avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder-avatar.png";
                  }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="font-semibold text-md max-600:text-sm">
                  {user?.displayName}
                </h2>
                <Button
                  onClick={handleSignOut}
                  className="cursor-pointer mt-2 max-600:text-[13px]"
                >
                  Sign Out
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer mt-2 bg-red-500 ml-2 text-white max-600:text-[13px]"
                >
                  Delete Account
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <>
            <Button className={"md:w-20 w-15"} onClick={toggleRegisterForm}>
              Register
            </Button>
            <Button className={"md:w-20 w-15"} onClick={toggleLoginForm}>
              Sign In
            </Button>
          </>
        )}
      </div>

      {showLoginForm && <LoginForm onClose={toggleLoginForm} />}
      {showRegisterForm && <RegisterForm onClose={toggleRegisterForm} />}

      {showDeleteModal && (
        <CustomConfirmationModal
          message="Are you sure you want to delete your account? This action is irreversible."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default Header;
