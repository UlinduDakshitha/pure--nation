import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import styles from "./Leaderboard.module.css";
import api from "../services/api";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/leaderboard");
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        console.log("Using mock leaderboard data");
        // Use mock data as fallback
        const mockLeaderboard = [
          {
            _id: "1",
            name: "Kasun Perera",
            projects: 15,
            badges: [{ name: "Eco Warrior" }, { name: "Top Cleaner" }],
            points: 2500,
          },
          {
            _id: "2",
            name: "Nimal Silva",
            projects: 12,
            badges: [{ name: "Beach Hero" }],
            points: 2100,
          },
          {
            _id: "3",
            name: "Amaya Fernando",
            projects: 10,
            badges: [{ name: "Green Champion" }],
            points: 1800,
          },
          {
            _id: "4",
            name: "Sandun Wickramasinghe",
            projects: 8,
            badges: [],
            points: 1500,
          },
          {
            _id: "5",
            name: "Dilini Jayawardena",
            projects: 7,
            badges: [{ name: "Community Star" }],
            points: 1200,
          },
        ];
        setLeaderboard(mockLeaderboard);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="container section text-center">
        Loading leaderboard...
      </div>
    );

  return (
    <div className="container section">
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Trophy size={48} className={styles.trophyIcon} />
        </div>
        <h1>Community Leaderboard</h1>
        <p className="text-secondary">
          Recognizing our top contributors making Sri Lanka cleaner.
        </p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rankCol}>Rank</th>
              <th>Volunteer</th>
              <th>Projects Joined</th>
              <th>Badges</th>
              <th className={styles.pointsCol}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user._id || index}
                className={index < 3 ? styles.topRank : ""}
              >
                <td className={styles.rankCol}>
                  {index === 0 && <Medal size={24} color="#FFD700" />}
                  {index === 1 && <Medal size={24} color="#C0C0C0" />}
                  {index === 2 && <Medal size={24} color="#CD7F32" />}
                  {index > 2 && (
                    <span className={styles.rankNum}>{index + 1}</span>
                  )}
                </td>
                <td className={styles.userCol}>
                  <div className={styles.avatar}>
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className={styles.name}>
                    {user.name || "Anonymous"}
                  </span>
                </td>
                <td>{user.projectsJoined?.length || user.projects || 0}</td>
                <td>
                  <div className={styles.badges}>
                    {(user.badges || []).map((badge, i) => (
                      <span key={i} className={styles.badge}>
                        <Award size={12} /> {badge.name || badge}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={styles.pointsCol}>
                  <strong>{user.points?.toLocaleString() || 0}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
