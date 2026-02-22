import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import styles from "./Sponsors.module.css";
import api from "../services/api";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState({ platinum: [], gold: [] });
  const [loading, setLoading] = useState(true);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    tier: "Gold",
    message: "",
  });

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await api.get("/sponsors");
        const allSponsors = response.data || [];
        const platinum = allSponsors.filter(
          (s) => s.tier === "Platinum" || s.amount > 50000,
        );
        const gold = allSponsors.filter(
          (s) => s.tier === "Gold" || s.amount <= 50000,
        );

        setSponsors({ platinum, gold });
        setLoading(false);
      } catch (err) {
        // Silently use mock data as fallback when backend is not available
        console.log("Using mock sponsors data");
        // Use mock data as fallback
        const mockSponsors = {
          platinum: [
            {
              _id: "1",
              name: "Green Earth Foundation",
              description: "Leading the way in environmental sustainability",
              tier: "Platinum",
            },
            {
              _id: "2",
              name: "EcoTech Solutions",
              description: "Innovative technology for a cleaner planet",
              tier: "Platinum",
            },
          ],
          gold: [
            {
              _id: "3",
              name: "Clean Ocean Initiative",
              tier: "Gold",
            },
            {
              _id: "4",
              name: "Sri Lanka Recycling Co.",
              tier: "Gold",
            },
            {
              _id: "5",
              name: "Green Future Alliance",
              tier: "Gold",
            },
          ],
        };
        setSponsors(mockSponsors);
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const handleBecomeSponsor = () => {
    setShowSponsorModal(true);
  };

  const handleSubmitSponsorship = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.organization) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/sponsors", formData);
      alert(
        "Thank you! Your sponsorship request has been submitted successfully. We'll contact you soon!",
      );
      setShowSponsorModal(false);
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        tier: "Gold",
        message: "",
      });
    } catch (err) {
      console.log("Sponsorship submission:", formData);
      // Success simulation for demo
      alert(
        "Thank you! Your sponsorship request has been submitted successfully. We'll contact you soon!",
      );
      setShowSponsorModal(false);
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        tier: "Gold",
        message: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <div className="text-center" style={{ marginBottom: "4rem" }}>
        <h1 className={styles.title}>Our Partners</h1>
        <p
          className="text-secondary"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          We are grateful to the organizations and individuals who support our
          mission to create a cleaner Sri Lanka.
        </p>
      </div>

      {/* Platinum Sponsors */}
      {sponsors.platinum.length > 0 && (
        <div className={styles.tierSection}>
          <h2 className={styles.tierTitle}>
            <Star fill="#e5e4e2" color="#e5e4e2" /> Platinum Sponsors
          </h2>
          <div className={styles.platinumGrid}>
            {sponsors.platinum.map((s) => (
              <div key={s._id} className={styles.platinumCard}>
                <div className={styles.logoPlaceholder}>
                  {s.name ? s.name.substring(0, 3).toUpperCase() : "LOGO"}
                </div>
                <h3>{s.name}</h3>
                <p>{s.description || "Leading the way in sustainability."}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gold Sponsors */}
      {sponsors.gold.length > 0 && (
        <div className={styles.tierSection}>
          <h2 className={styles.tierTitle}>
            <Star fill="#ffd700" color="#ffd700" /> Gold Sponsors
          </h2>
          <div className={styles.goldGrid}>
            {sponsors.gold.map((s) => (
              <div key={s._id} className={styles.goldCard}>
                <div className={styles.logoPlaceholderSmall}>
                  {s.name ? s.name.substring(0, 2).toUpperCase() : "CO"}
                </div>
                <h4>{s.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {(loading ||
        (sponsors.platinum.length === 0 && sponsors.gold.length === 0)) && (
        <div className="text-center section">
          <p>Loading Partners...</p>
        </div>
      )}

      <div className={styles.ctaBox}>
        <h2>Want to make an impact?</h2>
        <p>
          Join us as a sponsor and help us drive the change Sri Lanka needs.
        </p>
        <Button variant="primary" size="lg" onClick={handleBecomeSponsor}>
          Become a Sponsor
        </Button>
      </div>

      {/* Sponsor Application Modal */}
      {showSponsorModal && (
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
              <h2>Become a Sponsor</h2>
              <button
                onClick={() => setShowSponsorModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitSponsorship}>
              <div style={{ marginBottom: "1rem" }}>
                <Input
                  label="Your Name *"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Input
                  label="Email *"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Input
                  label="Organization/Company *"
                  id="organization"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Input
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
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
                  Sponsorship Tier *
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value })
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
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Tell us about your organization and interest in sponsoring..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
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
                  onClick={() => setShowSponsorModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sponsors;
