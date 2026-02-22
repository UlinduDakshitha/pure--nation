import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const url = error.config?.url;

    // Suppress 404 errors for endpoints with fallback data
    const fallbackEndpoints = [
      "/sponsors",
      "/leaderboard",
      "/events",
      "/user/profile",
    ];
    const hasFallback = fallbackEndpoints.some((endpoint) =>
      url?.includes(endpoint),
    );

    if (status === 404 && hasFallback) {
      // Silently reject for endpoints with fallback data
      return Promise.reject(error);
    }

    // Log other errors
    console.error("API Error Details:", {
      url: url,
      method: error.config?.method,
      status: status,
      data: data,
    });

    if (status === 401) {
      console.warn("Unauthorized - redirecting to login");
      // window.location.href = '/login';
    } else if (status === 400) {
      console.error("Bad Request - Check request format:", data);
    }

    return Promise.reject(error);
  },
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: (email, password) => {
    console.log("Calling login with:", { email });
    return api.post("/auth/login", { email, password });
  },
  logout: () => api.post("/auth/logout"),
  getStatus: () => api.get("/auth/status"),
  register: (userData) => {
    console.log("Calling register with:", userData);
    return api.post("/auth/register", userData);
  },
};

// ==================== EVENTS ENDPOINTS ====================
export const eventsAPI = {
  getAllEvents: () => api.get("/events"),
  getEventById: (id) => api.get(`/events/${id}`),
  registerForEvent: (userId, eventId) =>
    api.post("/events/register", { userId, eventId }),
  createEvent: (formData) =>
    api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ==================== ACHIEVEMENTS ENDPOINTS ====================
export const achievementsAPI = {
  getAchievements: () => api.get("/achievements"),
  createAchievement: (achievementData) =>
    api.post("/achievements", achievementData),
};

// ==================== INVOLVEMENT/OPPORTUNITIES ENDPOINTS ====================
export const involvementAPI = {
  getOpportunities: () => api.get("/involvement"),
  joinVolunteer: (userId, opportunityId) =>
    api.post("/involvement", { userId, opportunityId }),
  submitInterestRequest: (name, email, interest) =>
    api.post("/involvement/interest-request", { name, email, interest }),
};

// ==================== LEADERBOARD ENDPOINTS ====================
export const leaderboardAPI = {
  getLeaderboard: (type = "all-time") =>
    api.get("/leaderboard", { params: { type } }),
};

// ==================== PROOF/SUBMISSION ENDPOINTS ====================
export const proofAPI = {
  submitProof: (formData) =>
    api.post("/proof", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ==================== SPONSORS ENDPOINTS ====================
export const sponsorsAPI = {
  getAllSponsors: () => api.get("/sponsors"),
  getFeaturedSponsors: () => api.get("/sponsors/featured"),
  submitSponsorship: (sponsorData) => api.post("/sponsors", sponsorData),
};

// ==================== USER ENDPOINTS ====================
export const userAPI = {
  getUserProfile: (userId) => {
    console.log("Calling getUserProfile with userId:", userId);
    return api.get("/user/profile", { params: { userId } });
  },
  updateUserProfile: (userId, userData) => {
    console.log("Calling updateUserProfile with userId:", userId);
    if (!userId) {
      console.error("updateUserProfile called with undefined userId!");
      return Promise.reject(new Error("User ID is required"));
    }
    return api.put(`/user/${userId}`, userData);
  },
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  approveParticipation: (userId, eventId) =>
    api.post("/admin/participation/approve", { userId, eventId }),
  rejectParticipation: (userId, eventId) =>
    api.post("/admin/participation/reject", { userId, eventId }),
};

// ==================== DIAGNOSTIC ENDPOINT ====================
export const testConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/status`, {
      withCredentials: true,
    });
    console.log("Backend connection successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Backend connection failed:", error.message);
    throw error;
  }
};

export default api;
