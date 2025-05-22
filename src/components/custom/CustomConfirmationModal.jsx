import React from "react";
import { Button } from "../ui/button";

const CustomConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 max-600:p-5">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-xl font-semibold">{message}</h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="text-gray-700"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-red-500 text-white"
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
