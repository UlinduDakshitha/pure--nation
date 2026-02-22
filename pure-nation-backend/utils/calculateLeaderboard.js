// Example point strategy:
// - 10 points per hour of volunteering
// - 50 bonus points per event participated

function calculateLeaderboard(submissions, users) {
  const leaderboard = {};

  // Step 1: Aggregate hours and events per user
  submissions.forEach((submission) => {
    const userId = submission.userId.toString();

    if (!leaderboard[userId]) {
      leaderboard[userId] = {
        userId,
        name: '',
        eventsParticipated: new Set(),
        hoursContributed: 0,
        points: 0,
      };
    }

    leaderboard[userId].hoursContributed += submission.hours || 0;
    leaderboard[userId].eventsParticipated.add(submission.eventId.toString());
  });

  Object.keys(leaderboard).forEach((userId) => {
    const data = leaderboard[userId];
    data.eventsParticipated = Array.from(data.eventsParticipated);
    data.points = data.hoursContributed * 10 + data.eventsParticipated.length * 50;

    const user = users.find((u) => u._id.toString() === userId);
    data.name = user ? user.name : 'Unknown Volunteer';
  });

  const sorted = Object.values(leaderboard).sort((a, b) => b.points - a.points);

  return sorted;
}

module.exports = calculateLeaderboard;
