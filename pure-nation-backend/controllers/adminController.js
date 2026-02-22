app.post('/api/participation/approve', async (req, res) => {
  const { userId, eventId } = req.body;

  await Participation.updateOne(
    { userId, eventId },
    {
      adminApproved: true,
      approvedAt: new Date()
    }
  );

  res.json({ success: true });
});

// For reject
app.post('/api/participation/reject', async (req, res) => {
  const { userId, eventId } = req.body;

  await Participation.updateOne(
    { userId, eventId },
    {
      adminApproved: false,
      approvedAt: new Date()
    }
  );

  res.json({ success: true });
});
