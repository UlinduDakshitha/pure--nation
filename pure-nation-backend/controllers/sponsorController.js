const Sponsor = require("../models/Sponsor");

// POST /api/sponsors
// Submit a new sponsorship form
exports.submitSponsorship = async (req, res) => {
  const { name, email, organization, phone, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Name, email, and message are required.",
      });
  }

  try {
    const newSponsor = new Sponsor({
      name,
      email,
      organization,
      phone,
      message,
    });

    await newSponsor.save();

    res.status(201).json({
      success: true,
      message: "Thank you for becoming a sponsor! We will contact you soon.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit sponsorship.",
      error: error.message,
    });
  }
};

// GET /api/featured-sponsors
// exports.getFeaturedSponsors = async (req, res) => {
//   try {
//     const sponsors = await Sponsor.find({ featured: true }).lean();

//     res.json(sponsors);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve featured sponsors.',
//       error: error.message,
//     });
//   }
// };

exports.getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ createdAt: -1 });
    res.status(200).json(sponsors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch sponsors", error: error.message });
  }
};
