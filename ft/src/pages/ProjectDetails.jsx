import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Share2,
  CheckCircle,
} from "lucide-react";
import Button from "../components/common/Button";
import styles from "./ProjectDetails.module.css";
import api from "../services/api";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        console.log("Using mock project details data");
        // Use mock data as fallback
        const mockProject = {
          _id: id,
          title: "Beach Cleanup Initiative",
          location: "Mount Lavinia Beach",
          date: "2024-04-15",
          volunteers: 45,
          maxVolunteers: 100,
          type: "Beach Cleanup",
          description:
            "Join us for a comprehensive beach cleanup initiative. We will be collecting plastic waste, organizing recycling activities, and educating the community about marine conservation. This is a great opportunity to make a tangible difference in preserving our beautiful coastline.",
          organizer: "Pure Nation Foundation",
          contact: "info@purenation.lk",
          duration: "3 hours",
          requirements: [
            "Comfortable clothing",
            "Sun protection",
            "Water bottle",
            "Gloves (provided)",
          ],
        };
        setProject(mockProject);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading)
    return <div className="container section text-center">Loading...</div>;
  if (!project)
    return (
      <div className="container section text-center">Project not found</div>
    );

  return (
    <div className="container section">
      <div
        className={styles.imageHeader}
        style={{
          backgroundImage: `url(${project.image || "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"})`,
        }}
      >
        <div className={styles.overlay}>
          <h1>{project.title}</h1>
          <div className={styles.headerMeta}>
            <span>
              <MapPin size={20} /> {project.location}
            </span>
            <span>
              <Calendar size={20} />{" "}
              {new Date(project.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <h2>About the Project</h2>
          <p>{project.description}</p>

          <div className={styles.impactBox}>
            <h3>
              <CheckCircle size={20} className="text-secondary" /> Expected
              Impact
            </h3>
            <p>{project.impact}</p>
          </div>

          <h3>Location</h3>
          <div className={styles.mapPlaceholder}>
            <p>Google Maps Integration Placeholder</p>
            <p className="text-secondary">{project.location}</p>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Event Details</h3>
            <ul className={styles.detailList}>
              <li>
                <Clock size={18} className={styles.icon} />
                <div>
                  <strong>Time</strong>
                  <p>{project.time}</p>
                </div>
              </li>
              <li>
                <Users size={18} className={styles.icon} />
                <div>
                  <strong>Volunteers</strong>
                  <p>
                    {project.volunteers} / {project.maxVolunteers} joined
                  </p>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(project.volunteers / project.maxVolunteers) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </li>
              <li>
                <Users size={18} className={styles.icon} />
                <div>
                  <strong>Organizer</strong>
                  <p>{project.organizer}</p>
                </div>
              </li>
            </ul>

            {joined ? (
              <Button
                variant="outline"
                fullWidth
                disabled
                className={styles.successBtn}
              >
                Required Registered <CheckCircle size={16} />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setJoined(true)}
              >
                Volunteer Now
              </Button>
            )}

            <button className={styles.shareBtn}>
              <Share2 size={16} /> Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
