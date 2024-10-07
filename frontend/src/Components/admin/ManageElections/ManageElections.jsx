/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import CreateElectionForm from "../../election/ElectionForm/ElectionForm";
import UpdateElectionForm from "../../election/UpdateElectionForm/UpdateElectionForm";
import {
  getElections as fetchElections,
  createElection,
  updateElection,
  deleteElection,
} from "../../../api/electionApi";
import ElectionCard from "../../election/ElectionCard/ElectionCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure styles are imported

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch elections on component mount
  useEffect(() => {
    const loadElections = async () => {
      try {
        setLoading(true);
        const data = await fetchElections();
        console.log("Fetched elections:", data);
        setElections(data);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load elections. Please try again later.");
        toast.error("Failed to load elections.");
      } finally {
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  // Handle creating a new election
  const handleCreateElection = useCallback(async (data) => {
    try {
      console.log("Creating election with data:", data);
      // Show loading toast
      const toastId = toast.info("Creating election...", { autoClose: false });

      const newElection = await createElection(data);
      console.log("Election created successfully:", newElection);

      // Update elections state and log the updated list
      setElections((prevElections) => {
        const updatedElections = [...prevElections, newElection];
        console.log("Elections state updated:", updatedElections);
        return updatedElections;
      });

      // Update the toast to success
      toast.update(toastId, {
        render: "Election created successfully!",
        type: "success", // Changed from toast.TYPE.SUCCESS
        autoClose: 5000,
      });
    } catch (err) {
      console.error("Error creating election:", err);
      // Optionally dismiss the loading toast
      toast.dismiss();
      toast.error("Failed to create election. Please try again.");
    } finally {
      setIsCreating(false);
      console.log("Creation process finished, setIsCreating(false)");
    }
  }, []);

  // Handle updating an existing election
  const handleUpdateElection = useCallback(async (data) => {
    try {
      console.log("Updating election with data:", data);
      const toastId = toast.info("Updating election...", {
        autoClose: false,
      });

      const updatedElection = await updateElection(data);
      console.log("Election updated successfully:", updatedElection);

      // Update elections state and log the updated list
      setElections((prevElections) => {
        const newElections = prevElections.map((election) =>
          election.id === updatedElection.id ? updatedElection : election
        );
        console.log("Elections state updated:", newElections);
        return newElections;
      });

      // Update the toast to success
      toast.update(toastId, {
        render: "Election updated successfully!",
        type: "success", // Changed from toast.TYPE.SUCCESS
        autoClose: 5000,
      });
    } catch (err) {
      console.error("Error updating election:", err);
      toast.dismiss();
      toast.error("Failed to update election. Please try again.");
    } finally {
      setSelectedElection(null);
      console.log("Update process finished, setSelectedElection(null)");
    }
  }, []);

  // Handle deleting an election
  const handleDeleteElection = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        console.log("Deleting election with id:", id);
        const toastId = toast.info("Deleting election...", {
          autoClose: false,
        });

        await deleteElection(id);

        // Update elections state and log the updated list
        setElections((prevElections) => {
          const updatedElections = prevElections.filter(
            (election) => election.id !== id
          );
          console.log("Election deleted, updated elections:", updatedElections);
          return updatedElections;
        });

        // Update the toast to success
        toast.update(toastId, {
          render: "Election deleted successfully!",
          type: "success", // Changed from toast.TYPE.SUCCESS
          autoClose: 5000,
        });
      } catch (err) {
        console.error("Error deleting election:", err);
        toast.dismiss();
        toast.error("Failed to delete election. Please try again.");
      }
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <h1 className="text-3xl font-semibold mb-6">Manage Elections</h1>

      {/* Create Election Button */}
      <button
        type="button" // Prevents form submission behavior
        onClick={() => setIsCreating(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-transform transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Create Election</span>
      </button>

      {/* Create Election Form Modal */}
      {isCreating && (
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg transition duration-300 transform hover:shadow-lg">
          <CreateElectionForm
            onCreateElection={handleCreateElection}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {/* Update Election Form Modal */}
      {selectedElection && (
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg transition duration-300 transform hover:shadow-lg">
          <UpdateElectionForm
            election={selectedElection}
            onUpdateElection={handleUpdateElection}
            onCancel={() => setSelectedElection(null)}
          />
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <p className="text-gray-600">Loading elections...</p>}

      {/* Error Message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Elections List */}
      {Array.isArray(elections) && elections.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {elections.map((election) => (
            <ElectionCard
              key={election.id}
              election={election}
              onEdit={() => setSelectedElection(election)}
              onDelete={() => handleDeleteElection(election.id)}
              className="transition-transform transform hover:scale-105 hover:shadow-lg"
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && <p className="text-gray-600">No elections found.</p>
      )}
    </div>
  );
};

export default ManageElections;
