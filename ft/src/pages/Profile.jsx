import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Award,
  Upload,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import styles from "./Profile.module.css";
import { useAuth } from "../context/AuthContext";
import { userAPI, proofAPI } from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const {
    user: authUser,
    loading: authLoading,
    isLoggedIn,
    setUser,
  } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [proofFormData, setProofFormData] = useState({
    hours: "",
    description: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!authLoading && authUser) {
      const userId = authUser.id || authUser._id;
      if (userId) {
        const fetchProfile = async () => {
          try {
            const response = await userAPI.getUserProfile(userId);
            setProfileData(response.data);
            setLoading(false);
          } catch (err) {
            console.error("Failed to fetch profile:", err);
            setProfileData(authUser);
            setLoading(false);
          }
        };

        fetchProfile();
      }
    }
  }, [authUser, authLoading, isLoggedIn, navigate]);

  if (authLoading || loading) {
    return (
      <div className="container section text-center">Loading profile...</div>
    );
  }

  if (error) {
    return (
      <div className="container section text-center">
        <p style={{ color: "var(--error)" }}>{error}</p>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  const user = profileData || authUser;

  // Debug: Check user object structure
  console.log("📋 Full User object:", JSON.stringify(user, null, 2));
  console.log("📋 User properties:", Object.keys(user || {}));
  console.log("📋 User ID:", user?.id, "User _id:", user?._id);

  if (!user) {
    return (
      <div className="container section text-center">
        <p>No user data available</p>
      </div>
    );
  }

  // Mock data for projects/badges if not in user object yet
  const myProjects = user.projects || [
    {
      id: 1,
      title: "Mount Lavinia Beach Cleanup",
      status: "Upcoming",
      date: "2024-04-15",
    },
    {
      id: 2,
      title: "Kandy Lake Restoration",
      status: "Completed",
      date: "2024-03-10",
    },
  ];

  const badges = user.badges || [
    {
      name: "Eco Warrior",
      description: "Participated in 10+ projects",
      icon: "🌱",
    },
    { name: "Top Cleaner", description: "Collected 100kg+ waste", icon: "🏆" },
  ];

  const handleEditProfile = () => {
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      district: user.district || "",
      city: user.city || "",
    });
    setProfilePicture(null);
    setProfilePicturePreview(user.profilePicture || null);
    setShowEditModal(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSubmitting(true);
    try {
      const userId = user.id || user._id || authUser?.id || authUser?._id;
      console.log("🔍 Attempting to save profile with userId:", userId);
      console.log("🔍 User object:", user);
      console.log("🔍 AuthUser object:", authUser);

      if (!userId || userId === undefined || userId === null) {
        alert("User ID not found. Please login again.");
        setSubmitting(false);
        return;
      }

      let response;
      if (profilePicture) {
        // Use FormData if there's a profile picture
        const formData = new FormData();
        formData.append("firstName", editFormData.firstName);
        formData.append("lastName", editFormData.lastName);
        formData.append("district", editFormData.district);
        formData.append("city", editFormData.city);
        formData.append("profilePicture", profilePicture);
        response = await userAPI.updateUserProfile(userId, formData);
      } else {
        // Use JSON if no profile picture
        response = await userAPI.updateUserProfile(userId, editFormData);
      }

      if (response.data.success) {
        setProfileData(response.data.user);
        setUser(response.data.user);
        setShowEditModal(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitProof = (project) => {
    setSelectedProject(project);
    setProofFormData({ hours: "", description: "", file: null });
    setShowProofModal(true);
  };

  const handleProofSubmit = async () => {
    if (
      !proofFormData.hours ||
      !proofFormData.description ||
      !proofFormData.file
    ) {
      alert("Please fill in all fields and select a file");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("event", selectedProject.title);
      formData.append("hours", proofFormData.hours);
      formData.append("description", proofFormData.description);
      formData.append("file", proofFormData.file);

      const response = await proofAPI.submitProof(formData);
      if (response.data) {
        setShowProofModal(false);
        alert("Proof submitted successfully!");
        // Refresh profile
        const userId = authUser?.id || authUser?._id;
        if (userId) {
          const updated = await userAPI.getUserProfile(userId);
          setProfileData(updated.data);
        }
      }
    } catch (err) {
      console.error("Failed to submit proof:", err);
      alert(err.response?.data?.message || "Failed to submit proof");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <div className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : user.name ? (
            user.name.charAt(0).toUpperCase()
          ) : user.firstName ? (
            user.firstName.charAt(0).toUpperCase()
          ) : (
            "U"
          )}
        </div>
        <div className={styles.profileInfo}>
          <h1>
            {user.name ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim()}
          </h1>
          <p className="text-secondary">
            {user.email} • {user.district || "Not specified"} •{" "}
            {user.city || "Not specified"}
          </p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <strong>{user.volunteerHours || 0}</strong> <span>Hours</span>
            </div>
            <div className={styles.stat}>
              <strong>{user.eventsParticipated || myProjects.length}</strong>{" "}
              <span>Events</span>
            </div>
            <div className={styles.stat}>
              <strong>{badges.length}</strong> <span>Badges</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleEditProfile}>
          Edit Profile
        </Button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "projects" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("projects")}
        >
          My Projects
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "rewards" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("rewards")}
        >
          Rewards & Badges
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "projects" && (
          <div className={styles.projectList}>
            {myProjects.map((project) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <h3>{project.title}</h3>
                  <p className="text-secondary">
                    <Clock
                      size={14}
                      style={{ display: "inline", marginRight: "4px" }}
                    />{" "}
                    {project.date}
                  </p>
                </div>
                <div className={styles.projectAction}>
                  <span
                    className={`${styles.statusBadge} ${
                      project.status === "Completed"
                        ? styles.statusCompleted
                        : styles.statusUpcoming
                    }`}
                  >
                    {project.status}
                  </span>
                  {project.status === "Completed" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSubmitProof(project)}
                    >
                      <Upload size={14} style={{ marginRight: "6px" }} /> Submit
                      Proof
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "rewards" && (
          <div className={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <div key={index} className={styles.badgeCard}>
                <div className={styles.badgeIcon}>{badge.icon}</div>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
              </div>
            ))}

            {/* Locked Badge */}
            <div className={`${styles.badgeCard} ${styles.badgeLocked}`}>
              <div className={styles.badgeIcon}>🔒</div>
              <h4>Community Star</h4>
              <p>Refer 5 friends to unlock</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2>Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Picture Upload */}
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Profile Picture
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div className={styles.avatarLarge} style={{ margin: 0 }}>
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : user.firstName ? (
                    user.firstName.charAt(0).toUpperCase()
                  ) : (
                    "U"
                  )}
                </div>
                <label style={{ cursor: "pointer", display: "inline-block" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.75rem 1.5rem",
                      border: "2px solid var(--primary)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "transparent",
                      color: "var(--primary)",
                      fontWeight: "500",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--primary)";
                    }}
                  >
                    <Upload size={16} style={{ marginRight: "6px" }} />
                    Choose Photo
                  </span>
                </label>
                {profilePicture && (
                  <p
                    style={{
                      marginTop: 0,
                      color: "var(--success)",
                      fontSize: "0.875rem",
                    }}
                  >
                    ✓ {profilePicture.name}
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Input
                label="First Name"
                id="firstName"
                value={editFormData.firstName}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    firstName: e.target.value,
                  })
                }
              />
              <Input
                label="Last Name"
                id="lastName"
                value={editFormData.lastName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, lastName: e.target.value })
                }
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Input
                label="District"
                id="district"
                value={editFormData.district}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, district: e.target.value })
                }
              />
              <Input
                label="City"
                id="city"
                value={editFormData.city}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, city: e.target.value })
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Proof Modal */}
      {showProofModal && selectedProject && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2>Submit Proof - {selectedProject.title}</h2>
              <button
                onClick={() => setShowProofModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Input
                label="Volunteer Hours"
                type="number"
                id="hours"
                placeholder="e.g., 4"
                value={proofFormData.hours}
                onChange={(e) =>
                  setProofFormData({ ...proofFormData, hours: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Description
              </label>
              <textarea
                placeholder="Describe your contribution..."
                value={proofFormData.description}
                onChange={(e) =>
                  setProofFormData({
                    ...proofFormData,
                    description: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  minHeight: "100px",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Upload Proof (Photo/Certificate)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setProofFormData({
                    ...proofFormData,
                    file: e.target.files[0],
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                }}
              />
              {proofFormData.file && (
                <p style={{ marginTop: "0.5rem", color: "var(--success)" }}>
                  ✓ {proofFormData.file.name}
                </p>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outline"
                onClick={() => setShowProofModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleProofSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Proof"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
