import React from "react";
import { Button } from "../ui/button";

const CustomConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f3eadf] dark:bg-stone-800 p-5 rounded-2xl shadow-md w-96 ">
        <h3 className="text-xl font-semibold">{message}</h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="dark:text-white"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-red-500 dark:bg-red-500 text-white"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmationModal;
