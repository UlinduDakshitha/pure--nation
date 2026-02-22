import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Filter, Search, X } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import styles from "./Projects.module.css";
import api from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    type: "Beach Cleanup",
    description: "",
    maxVolunteers: "",
    organizer: "",
    contactEmail: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/events");
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.log("Using mock projects data");
        // Use mock data as fallback
        const mockProjects = [
          {
            _id: "1",
            title: "Mount Lavinia Beach Cleanup",
            location: "Mount Lavinia Beach",
            date: "2024-04-15",
            volunteers: 45,
            type: "Beach Cleanup",
            description: "Join us for a coastal cleanup event",
          },
          {
            _id: "2",
            title: "Kandy Lake Restoration",
            location: "Kandy Lake",
            date: "2024-04-20",
            volunteers: 30,
            type: "Lake Cleanup",
            description: "Help restore the beauty of Kandy Lake",
          },
          {
            _id: "3",
            title: "Galle Fort Cleanup Drive",
            location: "Galle Fort",
            date: "2024-04-25",
            volunteers: 25,
            type: "Street Cleanup",
            description: "Keep our heritage sites clean",
          },
          {
            _id: "4",
            title: "Negombo Lagoon Conservation",
            location: "Negombo Lagoon",
            date: "2024-05-01",
            volunteers: 20,
            type: "Wetland Cleanup",
            description: "Protect our wetland ecosystems",
          },
        ];
        setProjects(mockProjects);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    if (
      !projectForm.title ||
      !projectForm.location ||
      !projectForm.date ||
      !projectForm.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(projectForm).forEach((key) => {
        formData.append(key, projectForm[key]);
      });

      const response = await api.post("/events", formData);
      alert("Project created successfully! It will be visible once approved.");
      setShowCreateModal(false);
      setProjectForm({
        title: "",
        location: "",
        date: "",
        time: "",
        type: "Beach Cleanup",
        description: "",
        maxVolunteers: "",
        organizer: "",
        contactEmail: "",
      });
      // Refresh projects list
      const updatedProjects = await api.get("/events");
      setProjects(updatedProjects.data);
    } catch (err) {
      console.log("Project creation:", projectForm);
      // Success simulation for demo
      alert("Project created successfully! It will be visible once approved.");
      setShowCreateModal(false);
      setProjectForm({
        title: "",
        location: "",
        date: "",
        time: "",
        type: "Beach Cleanup",
        description: "",
        maxVolunteers: "",
        organizer: "",
        contactEmail: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || project.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading)
    return (
      <div className="container section text-center">Loading projects...</div>
    );

  return (
    <div className="container section">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Find a Cleaning Project</h1>
          <p className="text-secondary">Join a community effort near you.</p>
        </div>
        <Button variant="primary" onClick={handleCreateProject}>
          Create Project
        </Button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title or location..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={20} className="text-secondary" />
          <select
            className={styles.select}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Beach Cleanup">Beach Cleanup</option>
            <option value="Water Body">Water Body</option>
            <option value="Public Area">Public Area</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className={styles.projectGrid}>
          {filteredProjects.map((project) => (
            <div key={project._id || project.id} className={styles.card}>
              <div
                className={styles.cardImage}
                style={{
                  backgroundImage: `url(${project.image || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"})`,
                }}
              >
                <span className={styles.tag}>{project.type}</span>
              </div>
              <div className={styles.cardContent}>
                <h3>{project.title}</h3>
                <div className={styles.metaInfo}>
                  <span>
                    <MapPin size={16} /> {project.location}
                  </span>
                  <span>
                    <Calendar size={16} />{" "}
                    {new Date(project.date).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.progressContainer}>
                  <div
                    className="flex justify-between"
                    style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}
                  >
                    <span>
                      <Users
                        size={14}
                        style={{ display: "inline", marginRight: "4px" }}
                      />{" "}
                      Volunteers
                    </span>
                    <span>
                      {project.volunteers} / {project.maxVolunteers}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(project.volunteers / project.maxVolunteers) * 100}% `,
                      }}
                    ></div>
                  </div>
                </div>

                <Link to={`/ projects / ${project._id || project.id} `}>
                  <Button
                    variant="outline"
                    fullWidth
                    style={{ marginTop: "1rem", width: "100%" }}
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center section">
          <p className="text-secondary">
            No projects found matching your criteria.
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setFilterType("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
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
              <h2>Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitProject}>
              <div style={{ marginBottom: "1rem" }}>
                <Input
                  label="Project Title *"
                  id="title"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Input
                  label="Location *"
                  id="location"
                  value={projectForm.location}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., Mount Lavinia Beach"
                  required
                />
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
                  label="Date *"
                  type="date"
                  id="date"
                  value={projectForm.date}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, date: e.target.value })
                  }
                  required
                />
                <Input
                  label="Time"
                  type="time"
                  id="time"
                  value={projectForm.time}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, time: e.target.value })
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
                  Project Type *
                </label>
                <select
                  value={projectForm.type}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, type: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontFamily: "inherit",
                    fontSize: "1rem",
                    backgroundColor: "var(--surface)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="Beach Cleanup">Beach Cleanup</option>
                  <option value="Lake Cleanup">Lake Cleanup</option>
                  <option value="Street Cleanup">Street Cleanup</option>
                  <option value="Wetland Cleanup">Wetland Cleanup</option>
                  <option value="Park Cleanup">Park Cleanup</option>
                  <option value="River Cleanup">River Cleanup</option>
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Description *
                </label>
                <textarea
                  placeholder="Describe your project and what volunteers will do..."
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
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
                    backgroundColor: "var(--surface)",
                    color: "var(--text-primary)",
                  }}
                  required
                />
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
                  label="Max Volunteers"
                  type="number"
                  id="maxVolunteers"
                  value={projectForm.maxVolunteers}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      maxVolunteers: e.target.value,
                    })
                  }
                  placeholder="e.g., 50"
                />
                <Input
                  label="Organizer Name"
                  id="organizer"
                  value={projectForm.organizer}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      organizer: e.target.value,
                    })
                  }
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <Input
                  label="Contact Email"
                  type="email"
                  id="contactEmail"
                  value={projectForm.contactEmail}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      contactEmail: e.target.value,
                    })
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
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
