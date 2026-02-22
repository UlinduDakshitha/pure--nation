const express = require("express");
const router = express.Router();
const Sponsor = require("../models/Sponsor");
const { getAllSponsors } = require("../controllers/sponsorController");

// GET featured sponsors (no change needed)
router.get("/all", getAllSponsors);

// POST new sponsor (change route path to '/')
router.post("/", async (req, res) => {
  const { name, email, organization, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing: name, email, and message",
    });
  }

  try {
    const newSponsor = new Sponsor({
      name,
      email,
      organization,
      phone,
      message,
      isFeatured: false,
    });

    await newSponsor.save();

    res.status(201).json({
      success: true,
      message: "Thank you for becoming a sponsor! We will contact you soon.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit sponsor request",
      error: error.message,
    });
  }
});

module.exports = router;
