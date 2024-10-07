/* eslint-disable no-unused-vars */
// src/components/ElectionForm.jsx
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  CalendarIcon,
  ClockIcon,
  PencilSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const ElectionForm = ({ onCreateElection }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handler for form input changes
  const handleChange = useCallback(
    (field) => (event) => {
      setFormData((prevData) => ({ ...prevData, [field]: event.target.value }));
      setError(""); // Reset error on input change
    },
    []
  );

  // Validate form data
  const validateForm = () => {
    const { startDate, startTime, endDate, endTime } = formData;
    if (
      new Date(`${startDate}T${startTime}`) >= new Date(`${endDate}T${endTime}`)
    ) {
      setError("End date and time must be after start date and time.");
      return false;
    }
    return true;
  };

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh
    setError(""); // Reset error messages

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Start loading state

    const { startDate, startTime, endDate, endTime, ...rest } = formData;
    const startDateTime = `${startDate}T${startTime}:00Z`; // Ensure UTC format
    const endDateTime = `${endDate}T${endTime}:00Z`; // Ensure UTC format

    try {
      await onCreateElection({
        ...rest,
        startDate: startDateTime,
        endDate: endDateTime,
      });
      // Optionally reset the form after successful submission
      setFormData({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      });
    } catch (submissionError) {
      setError(submissionError.message || "Failed to create election.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handler to reset the form
  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
    setError("");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-semibold mb-6 flex items-center">
        <PencilSquareIcon className="w-6 h-6 text-blue-600 mr-2" />
        Create Election
      </h1>
      <form onSubmit={handleSubmit} noValidate>
        {/* Title Input */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            <PencilSquareIcon className="w-5 h-5 text-gray-500 inline-block mr-2" />
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="Enter election title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            aria-required="true"
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            <DocumentTextIcon className="w-5 h-5 text-gray-500 inline-block mr-2" />
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Enter election description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="3"
            required
            aria-required="true"
          />
        </div>

        {/* Start Date & Time */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="border rounded-lg p-4">
            <h2 className="text-md font-semibold mb-2 text-gray-700">
              Start Date & Time
            </h2>
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange("startDate")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange("startTime")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="border rounded-lg p-4">
            <h2 className="text-md font-semibold mb-2 text-gray-700">
              End Date & Time
            </h2>
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange("endDate")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange("endTime")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button" // Prevents form submission
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              "Create Election"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

ElectionForm.propTypes = {
  onCreateElection: PropTypes.func.isRequired,
};

export default ElectionForm;
