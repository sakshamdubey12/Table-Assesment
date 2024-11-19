import axios from "axios";
import { Loader2 } from "lucide-react";
import Logo from "../images/Vector.png";
import cloud from "../images/cloud.png";
import Active from "../images/Active.png";
import Deactivate from "../images/Deactivate.png";
import Green from "../images/green.png";
import Orange from "../images/orange.png";
import Edge from "../images/Edge.png";
import Health_Empty from "../images/health_empty.png";
import React, { useEffect, useState } from "react";

const Table = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  // const uniqueLocations = Array.from(new Set(cameras.map(camera => camera.location)));
  // const uniqueStatuses = Array.from(new Set(cameras.map(camera => camera.status)));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api-app-staging.wobot.ai/app/v1/fetch/cameras`,
          {
            headers: { Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy` },
          }
        );
        setCameras(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching camera data:", error);
        setCameras([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const toggleLocationDropdown = () => setLocationDropdownOpen(!locationDropdownOpen);
  const toggleStatusDropdown = () => setStatusDropdownOpen(!statusDropdownOpen);

  const filterByLocation = (location) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  const filterByStatus = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };



  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const filteredCameras = cameras.filter(camera => 
    (!selectedLocation || camera.location === selectedLocation) &&
    (!selectedStatus || camera.status === selectedStatus)
  );

  // Calculate displayed cameras for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCameras = filteredCameras.slice(startIndex, startIndex + itemsPerPage);


  const toggleCameraStatus = async (id, newStatus) => {
    try {
      await axios.put(
        "https://api-app-staging.wobot.ai/app/v1/update/camera/status",
        { id, status: newStatus },
        {
          headers: {
            Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy`,
          },
        }
      );

      setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.id === id ? { ...camera, status: newStatus } : camera
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const deleteCamera = (id) => {
    if (window.confirm("Are you sure you want to delete this camera?")) {
      setCameras((prevCameras) =>
        prevCameras.filter((camera) => camera.id !== id)
      );
    }
  };
  const uniqueLocations = Array.from(new Set(cameras.map(camera => camera.location)));
  const uniqueStatuses = Array.from(new Set(cameras.map(camera => camera.status)));
  return (
    <div className="p-5 flex flex-col">
      <div className="flex justify-center">
        <img src={Logo} alt="" />
      </div>
      <div className="flex justify-between mt-8">
        <div>
          <h1 className="text-2xl font-semibold">Cameras</h1>
          <p className="mt-3 text-base">Manage your cameras here.</p>
        </div>
        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <div className="flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center pb-4 relative">
        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={toggleLocationDropdown}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
          >
            {selectedLocation || 'Location'}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {locationDropdownOpen && (
            <div className="absolute overflow-y-scroll h-80 top-12 left-0 z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
              <ul className="p-3 space-y-1 text-sm text-gray-700">
                <li>
                  <button onClick={() => filterByLocation(null)} className="w-full text-left p-2 hover:bg-gray-100">
                    All Locations
                  </button>
                </li>
                {uniqueLocations.map((location) => (
                  <li key={location}>
                    <button onClick={() => filterByLocation(location)} className="w-full text-left p-2 hover:bg-gray-100">
                      {location}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={toggleStatusDropdown}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
          >
            {selectedStatus || 'Status'}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {statusDropdownOpen && (
            <div className="absolute top-12 left-0 z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
              <ul className="p-3 space-y-1 text-sm text-gray-700">
                <li>
                  <button onClick={() => filterByStatus(null)} className="w-full text-left p-2 hover:bg-gray-100">
                    All Statuses
                  </button>
                </li>
                {uniqueStatuses.map((status) => (
                  <li key={status}>
                    <button onClick={() => filterByStatus(status)} className="w-full text-left p-2 hover:bg-gray-100">
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="p-4">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
              </th>
              <th className="px-6 py-3 font-bold">NAME</th>
              <th className="px-6 py-3 font-bold">HEALTH</th>
              <th className="px-6 py-3 font-bold">LOCATION</th>
              <th className="px-6 py-3 font-bold">RECORDER</th>
              <th className="px-6 py-3 font-bold">TASK</th>
              <th className="px-6 py-3 font-bold">STATUS</th>
              <th className="px-6 py-3 font-bold">ACTIONS</th>
              {/* <th className="px-6 py-3 font-bold">REMOVE</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="flex justify-center py-4 absolute left-[750px] items-center">
                <Loader2 className="animate-spin text-black w-6 h-6 mx-auto" />
              </div>
            ) : (
              <>
                {currentCameras.map((camera) => (
                  <tr
                    key={camera.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4">{camera.name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {camera.health?.cloud && camera.health?.device ? (
                        <div className="flex gap-5">
                          <div className="flex gap-1">
                            <img src={cloud} alt="Cloud Icon" className="" />
                            <div className="flex relative">
                              <img
                                src={
                                  camera.health.cloud === "A" ? Green : Orange
                                }
                                alt=""
                              />
                              <span className="absolute left-2">
                                {camera.health.cloud}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <img src={Edge} alt="Edge Icon" className="" />
                            <div className="flex relative">
                              <img
                                src={
                                  camera.health.device === "A" ? Green : Orange
                                }
                                alt=""
                              />
                              <span className="absolute left-2">
                                {camera.health.device}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-5">
                          <div className="flex gap-1">
                            <img src={cloud} alt="Cloud Icon" className="" />
                            <div className="flex relative">
                              <img src={Health_Empty} alt="" />
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <img src={Edge} alt="Edge Icon" className="" />
                            <div className="flex relative">
                              <img src={Health_Empty} alt="" />
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{camera.location || "N/A"}</td>
                    <td className="px-6 py-4">{camera.recorder || "N/A"}</td>
                    <td className="px-6 py-4">{camera.tasks || "N/A"} Tasks</td>
                    <td className="px-6 py-4 flex items-start text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                          camera.status === "Active"
                            ? "bg-green-100 text-green-500 font-medium"
                            : "bg-gray-200 text-gray-700 font-medium"
                        }`}
                      >
                        {camera.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleCameraStatus(
                            camera.id,
                            camera.status === "Active" ? "Inactive" : "Active"
                          )
                        }
                        className="font-medium"
                      >
                        {camera.status === "Active" ? (
                          <img src={Deactivate} alt="Deactivate" />
                        ) : (
                          <img src={Active} className="ml-1" alt="Activate" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteCamera(camera.id)}
                        className="ml-4 text-red-500 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end text-white font-medium items-center p-5 mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-800 rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <span className="text-black font-medium text-base">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-800 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Table;
