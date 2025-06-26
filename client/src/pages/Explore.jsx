import React, { useState, useEffect } from "react";
import useListingStore from "../store/listingStore";
import useAuthStore from "../store/authStore";

const Explore = () => {
  const {
    listings,
    myListings,
    currentListing,
    loading,
    error,
    pagination,
    getAllListings,
    getListingById,
    getMyListings,
    createListing,
    updateListing,
    deleteListing,
    checkAvailability,
    clearCurrentListing,
    clearError,
  } = useListingStore();

  const { user } = useAuthStore();

  // Filter states
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
    amenities: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Create listing form state
  const [createForm, setCreateForm] = useState({
    propertyName: "",
    propertyType: "apartment",
    description: "",
    city: "",
    location: { lat: 0, lng: 0, address: "" },
    pricePerDay: "",
    amenities: [],
    capacity: { guests: 1, bedrooms: 1, bathrooms: 1 },
    mainImage: "",
    subsidiaryImages: [],
  });

  // Update form state
  const [updateForm, setUpdateForm] = useState({});
  const [selectedListingId, setSelectedListingId] = useState("");

  // Availability check state
  const [availabilityForm, setAvailabilityForm] = useState({
    listingId: "",
    checkInDate: "",
    checkOutDate: "",
  });

  // Load all listings on component mount
  useEffect(() => {
    getAllListings(filters);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    getAllListings(filters);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    getAllListings(newFilters);
  };

  // Handle create form changes
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "amenities") {
      setCreateForm((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else if (name.startsWith("capacity.")) {
      const field = name.split(".")[1];
      setCreateForm((prev) => ({
        ...prev,
        capacity: { ...prev.capacity, [field]: parseInt(value) },
      }));
    } else if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setCreateForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: field === "address" ? value : parseFloat(value),
        },
      }));
    } else {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "mainImage") {
      setCreateForm((prev) => ({ ...prev, mainImage: files[0] }));
    } else if (name === "subsidiaryImages") {
      setCreateForm((prev) => ({
        ...prev,
        subsidiaryImages: Array.from(files),
      }));
    }
  };

  // Create listing
  const handleCreateListing = async (e) => {
    e.preventDefault();
    const result = await createListing(createForm);
    if (result.success) {
      alert("Listing created successfully!");
      setCreateForm({
        propertyName: "",
        propertyType: "apartment",
        description: "",
        city: "",
        location: { lat: 0, lng: 0, address: "" },
        pricePerDay: "",
        amenities: [],
        capacity: { guests: 1, bedrooms: 1, bathrooms: 1 },
        mainImage: "",
        subsidiaryImages: [],
      });
      // Refresh listings
      getAllListings(filters);
    } else {
      alert("Error: " + result.error);
    }
  };

  // Get listing details
  const handleGetListingDetails = async (id) => {
    const result = await getListingById(id);
    if (result.success) {
      console.log("Listing details:", result.listing);
    }
  };

  // Get my listings
  const handleGetMyListings = async () => {
    const result = await getMyListings();
    if (result.success) {
      console.log("My listings loaded");
    }
  };

  // Prepare update form
  const handlePrepareUpdate = (listing) => {
    setSelectedListingId(listing._id);
    setUpdateForm({
      propertyName: listing.propertyName,
      description: listing.description,
      pricePerDay: listing.pricePerDay,
      // Add other fields you want to update
    });
  };

  // Handle update form changes
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Update listing
  const handleUpdateListing = async (e) => {
    e.preventDefault();
    if (!selectedListingId) return;

    const result = await updateListing(selectedListingId, updateForm);
    if (result.success) {
      alert("Listing updated successfully!");
      setSelectedListingId("");
      setUpdateForm({});
      // Refresh listings
      getAllListings(filters);
      getMyListings();
    } else {
      alert("Error: " + result.error);
    }
  };

  // Delete listing
  const handleDeleteListing = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      const result = await deleteListing(id);
      if (result.success) {
        alert("Listing deleted successfully!");
        // Refresh listings
        getAllListings(filters);
        getMyListings();
      } else {
        alert("Error: " + result.error);
      }
    }
  };

  // Handle availability form changes
  const handleAvailabilityFormChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityForm((prev) => ({ ...prev, [name]: value }));
  };

  // Check availability
  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    const { listingId, checkInDate, checkOutDate } = availabilityForm;
    const result = await checkAvailability(
      listingId,
      checkInDate,
      checkOutDate
    );
    if (result.success) {
      alert(
        `Availability: ${
          result.data.isAvailable ? "Available" : "Not Available"
        }`
      );
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Explore Page - Listing Integration Test</h1>

      {loading && <div>Loading...</div>}
      {error && (
        <div style={{ color: "red" }}>
          Error: {error} <button onClick={clearError}>Clear</button>
        </div>
      )}

      {/* Filters Section */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Filters</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          <input
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="room">Room</option>
          </select>
          <input
            name="minPrice"
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            name="maxPrice"
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <input
            name="guests"
            type="number"
            placeholder="Guests"
            value={filters.guests}
            onChange={handleFilterChange}
          />
          <input
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={filters.amenities}
            onChange={handleFilterChange}
          />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Created Date</option>
            <option value="pricePerDay">Price</option>
            <option value="propertyName">Name</option>
          </select>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <button onClick={handleApplyFilters} style={{ marginTop: "10px" }}>
          Apply Filters
        </button>
      </div>

      {/* Create Listing Section */}
      {user && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>Create New Listing</h2>
          <form onSubmit={handleCreateListing}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              <input
                name="propertyName"
                placeholder="Property Name"
                value={createForm.propertyName}
                onChange={handleCreateFormChange}
                required
              />
              <select
                name="propertyType"
                value={createForm.propertyType}
                onChange={handleCreateFormChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="room">Room</option>
              </select>
              <input
                name="city"
                placeholder="City"
                value={createForm.city}
                onChange={handleCreateFormChange}
                required
              />
              <input
                name="pricePerDay"
                type="number"
                placeholder="Price Per Day"
                value={createForm.pricePerDay}
                onChange={handleCreateFormChange}
                required
              />
              <input
                name="location.address"
                placeholder="Address"
                value={createForm.location.address}
                onChange={handleCreateFormChange}
              />
              <input
                name="location.lat"
                type="number"
                step="any"
                placeholder="Latitude"
                value={createForm.location.lat}
                onChange={handleCreateFormChange}
              />
              <input
                name="location.lng"
                type="number"
                step="any"
                placeholder="Longitude"
                value={createForm.location.lng}
                onChange={handleCreateFormChange}
              />
              <input
                name="amenities"
                placeholder="Amenities (comma separated)"
                value={createForm.amenities.join(", ")}
                onChange={handleCreateFormChange}
              />
              <input
                name="capacity.guests"
                type="number"
                placeholder="Max Guests"
                value={createForm.capacity.guests}
                onChange={handleCreateFormChange}
              />
              <input
                name="capacity.bedrooms"
                type="number"
                placeholder="Bedrooms"
                value={createForm.capacity.bedrooms}
                onChange={handleCreateFormChange}
              />
              <input
                name="capacity.bathrooms"
                type="number"
                placeholder="Bathrooms"
                value={createForm.capacity.bathrooms}
                onChange={handleCreateFormChange}
              />
              <input
                name="mainImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <input
                name="subsidiaryImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={createForm.description}
              onChange={handleCreateFormChange}
              style={{ width: "100%", marginTop: "10px" }}
              required
            />
            <button type="submit" style={{ marginTop: "10px" }}>
              Create Listing
            </button>
          </form>
        </div>
      )}

      {/* My Listings Section */}
      {user && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>My Listings</h2>
          <button onClick={handleGetMyListings}>Load My Listings</button>
          {myListings.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              {myListings.map((listing) => (
                <div
                  key={listing._id}
                  style={{
                    border: "1px solid #eee",
                    padding: "10px",
                    margin: "5px 0",
                  }}
                >
                  <h4>{listing.propertyName}</h4>
                  <p>Price: ${listing.pricePerDay}/day</p>
                  <p>City: {listing.city}</p>
                  <button onClick={() => handlePrepareUpdate(listing)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update Listing Section */}
      {selectedListingId && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>Update Listing</h2>
          <form onSubmit={handleUpdateListing}>
            <input
              name="propertyName"
              placeholder="Property Name"
              value={updateForm.propertyName || ""}
              onChange={handleUpdateFormChange}
            />
            <input
              name="pricePerDay"
              type="number"
              placeholder="Price Per Day"
              value={updateForm.pricePerDay || ""}
              onChange={handleUpdateFormChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={updateForm.description || ""}
              onChange={handleUpdateFormChange}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <div style={{ marginTop: "10px" }}>
              <button type="submit">Update Listing</button>
              <button
                type="button"
                onClick={() => {
                  setSelectedListingId("");
                  setUpdateForm({});
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Availability Check Section */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Check Availability</h2>
        <form onSubmit={handleCheckAvailability}>
          <input
            name="listingId"
            placeholder="Listing ID"
            value={availabilityForm.listingId}
            onChange={handleAvailabilityFormChange}
            required
          />
          <input
            name="checkInDate"
            type="date"
            value={availabilityForm.checkInDate}
            onChange={handleAvailabilityFormChange}
            required
          />
          <input
            name="checkOutDate"
            type="date"
            value={availabilityForm.checkOutDate}
            onChange={handleAvailabilityFormChange}
            required
          />
          <button type="submit">Check Availability</button>
        </form>
      </div>

      {/* Listings Display */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>All Listings ({pagination.totalListings})</h2>
        {listings.length > 0 ? (
          <div>
            {listings.map((listing) => (
              <div
                key={listing._id}
                style={{
                  border: "1px solid #eee",
                  padding: "15px",
                  margin: "10px 0",
                }}
              >
                <h3>{listing.propertyName}</h3>
                <p>
                  <strong>Type:</strong> {listing.propertyType}
                </p>
                <p>
                  <strong>City:</strong> {listing.city}
                </p>
                <p>
                  <strong>Price:</strong> ${listing.pricePerDay}/day
                </p>
                <p>
                  <strong>Capacity:</strong> {listing.capacity?.guests} guests
                </p>
                <p>
                  <strong>Owner:</strong> {listing.owner?.name}
                </p>
                <p>
                  <strong>Description:</strong> {listing.description}
                </p>
                {listing.mainImage && (
                  <img
                    src={listing.mainImage}
                    alt={listing.propertyName}
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => handleGetListingDetails(listing._id)}>
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      setAvailabilityForm((prev) => ({
                        ...prev,
                        listingId: listing._id,
                      }))
                    }
                    style={{ marginLeft: "10px" }}
                  >
                    Set for Availability Check
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No listings found</p>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      )}

      {/* Current Listing Details */}
      {currentListing && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>Current Listing Details</h2>
          <button onClick={clearCurrentListing} style={{ float: "right" }}>
            Close
          </button>
          <h3>{currentListing.propertyName}</h3>
          <p>
            <strong>Type:</strong> {currentListing.propertyType}
          </p>
          <p>
            <strong>Description:</strong> {currentListing.description}
          </p>
          <p>
            <strong>City:</strong> {currentListing.city}
          </p>
          <p>
            <strong>Price:</strong> ${currentListing.pricePerDay}/day
          </p>
          <p>
            <strong>Capacity:</strong> {currentListing.capacity?.guests} guests,{" "}
            {currentListing.capacity?.bedrooms} bedrooms,{" "}
            {currentListing.capacity?.bathrooms} bathrooms
          </p>
          <p>
            <strong>Amenities:</strong> {currentListing.amenities?.join(", ")}
          </p>
          <p>
            <strong>Owner:</strong> {currentListing.owner?.name} (
            {currentListing.owner?.email})
          </p>
          {currentListing.reviews && currentListing.reviews.length > 0 && (
            <div>
              <h4>Reviews:</h4>
              {currentListing.reviews.map((review) => (
                <div
                  key={review._id}
                  style={{ marginLeft: "20px", marginBottom: "10px" }}
                >
                  <p>
                    <strong>{review.reviewer?.name}:</strong> {review.comment}
                  </p>
                  <p>Rating: {review.rating}/5</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
