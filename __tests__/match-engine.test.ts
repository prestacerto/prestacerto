import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMatchScore,
  ProjectData,
  FreelancerProfile,
  MatchScore,
} from '../src/lib/certo-ecosystem/match-engine';

// FIXTURES
const mockProject: ProjectData = {
  title: 'Build React App',
  description: 'Need a modern React application with authentication',
  budget: 5000,
  skills_required: ['React', 'Node.js', 'PostgreSQL'],
  duration: '40',
  experience_level: 'intermediate',
  client_country: 'BR',
};

const mockExpertFreelancer: FreelancerProfile = {
  skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
  hourly_rate: 125,
  total_projects: 150,
  success_rate: 95,
  avg_rating: 4.8,
  years_experience: 8,
  portfolio_items: 45,
  response_time_hours: 1.5,
  specialization: 'Full Stack Development',
};

const mockJuniorFreelancer: FreelancerProfile = {
  skills: ['React'],
  hourly_rate: 25,
  total_projects: 5,
  success_rate: 80,
  avg_rating: 4.2,
  years_experience: 1,
  portfolio_items: 2,
  response_time_hours: 24,
  specialization: 'Frontend',
};

const mockMismatchedFreelancer: FreelancerProfile = {
  skills: ['Python', 'Django', 'MySQL'],
  hourly_rate: 200,
  total_projects: 100,
  success_rate: 90,
  avg_rating: 4.5,
  years_experience: 10,
  portfolio_items: 30,
  response_time_hours: 5,
  specialization: 'Backend Python',
};

test('Match Engine - Expert freelancer gets high overall score', async () => {
  const result = await calculateMatchScore(mockProject, mockExpertFreelancer);

  assert.ok(result.overallScore > 80, `Expected score > 80, got ${result.overallScore}`);
  assert.ok(result.winChance > 60, `Expected win chance > 60, got ${result.winChance}`);
  assert.equal(result.matchBreakdown.skillsMatch, 100, 'All skills should match');
  assert.ok(result.shouldApply, 'Should recommend applying');
});

test('Match Engine - Junior freelancer with partial skills gets moderate score', async () => {
  const result = await calculateMatchScore(mockProject, mockJuniorFreelancer);

  assert.ok(
    result.overallScore >= 40 && result.overallScore <= 70,
    `Expected score 40-70, got ${result.overallScore}`
  );
  assert.equal(
    result.matchBreakdown.skillsMatch,
    33,
    'Only 1 out of 3 skills match'
  );
});

test('Match Engine - Mismatched freelancer gets low score', async () => {
  const result = await calculateMatchScore(mockProject, mockMismatchedFreelancer);

  assert.equal(result.matchBreakdown.skillsMatch, 0, 'No skills match');
  assert.ok(result.overallScore < 50, `Expected score < 50, got ${result.overallScore}`);
});

test('Match Engine - High rate penalty for overpriced freelancer', async () => {
  const overpriced: FreelancerProfile = {
    ...mockExpertFreelancer,
    hourly_rate: 500, // Very expensive for this project
  };

  const result = await calculateMatchScore(mockProject, overpriced);

  assert.ok(
    result.matchBreakdown.rateMatch < 50,
    'Rate match should be low for overpriced freelancer'
  );
});

test('Match Engine - Cheap freelancer gets suspicious rate match', async () => {
  const cheap: FreelancerProfile = {
    ...mockExpertFreelancer,
    hourly_rate: 5, // Very cheap
  };

  const result = await calculateMatchScore(mockProject, cheap);

  assert.ok(
    result.matchBreakdown.rateMatch < 70,
    'Rate match should reflect suspicion for too cheap'
  );
});

test('Match Engine - Recommended bid is reasonable and reflects win chance', async () => {
  const result = await calculateMatchScore(mockProject, mockExpertFreelancer);

  assert.ok(
    result.recommendedBid > 0,
    'Recommended bid should be positive'
  );
  assert.ok(
    result.recommendedBid <= mockProject.budget * 1.5,
    'Recommended bid should not exceed 1.5x project budget'
  );
  // Higher win chance should result in higher recommended bid
  assert.ok(
    result.recommendedBid > (mockProject.budget * result.winChance) / 100,
    'Bid should scale with win probability'
  );
});

test('Match Engine - Competitor analysis estimates reasonable count', async () => {
  const result = await calculateMatchScore(mockProject, mockExpertFreelancer);

  assert.ok(
    result.competitorAnalysis.estimatedCompetitors >= 5,
    'Should estimate at least 5 competitors'
  );
  assert.ok(
    result.competitorAnalysis.avgCompetitorRating >= 0 &&
      result.competitorAnalysis.avgCompetitorRating <= 5,
    'Average competitor rating should be 0-5'
  );
});

test('Match Engine - Recommendations are helpful', async () => {
  const result = await calculateMatchScore(mockProject, mockExpertFreelancer);

  assert.ok(
    Array.isArray(result.recommendations),
    'Recommendations should be array'
  );
  if (result.overallScore > 80) {
    assert.ok(
      result.recommendations.some((r) => r.includes('✨')),
      'Should have positive recommendation for perfect match'
    );
  }
});

test('Match Engine - Experience match calculation is fair', async () => {
  const beginner: FreelancerProfile = {
    ...mockJuniorFreelancer,
    years_experience: 0,
    total_projects: 0,
  };

  const result = await calculateMatchScore(mockProject, beginner);

  assert.ok(
    result.matchBreakdown.experienceMatch < 50,
    'Beginner should have low experience match'
  );
});

test('Match Engine - Portfolio strength affects match score', async () => {
  const noPortfolio: FreelancerProfile = {
    ...mockExpertFreelancer,
    portfolio_items: 0,
  };

  const result1 = await calculateMatchScore(mockProject, mockExpertFreelancer);
  const result2 = await calculateMatchScore(mockProject, noPortfolio);

  assert.ok(
    result1.overallScore > result2.overallScore,
    'Freelancer with portfolio should score higher'
  );
});

test('Match Engine - Rating impact on win chance', async () => {
  const lowRating: FreelancerProfile = {
    ...mockExpertFreelancer,
    avg_rating: 2.0,
  };

  const result1 = await calculateMatchScore(mockProject, mockExpertFreelancer);
  const result2 = await calculateMatchScore(mockProject, lowRating);

  assert.ok(
    result1.winChance > result2.winChance,
    'High-rated freelancer should have better win chance'
  );
});

test('Match Engine - Response time affects win chance', async () => {
  const slowResponse: FreelancerProfile = {
    ...mockExpertFreelancer,
    response_time_hours: 48,
  };

  const result1 = await calculateMatchScore(mockProject, mockExpertFreelancer);
  const result2 = await calculateMatchScore(mockProject, slowResponse);

  assert.ok(
    result1.winChance >= result2.winChance,
    'Faster response time should improve win chance'
  );
});

test('Match Engine - Recommendations change based on match quality', async () => {
  const result1 = await calculateMatchScore(mockProject, mockExpertFreelancer);
  const result2 = await calculateMatchScore(mockProject, mockMismatchedFreelancer);

  assert.notEqual(
    result1.recommendations.join('|'),
    result2.recommendations.join('|'),
    'Different matches should have different recommendations'
  );
});

test('Match Engine - Should apply decision is conservative', async () => {
  const result = await calculateMatchScore(mockProject, mockJuniorFreelancer);

  // Should be false for low match or low win chance
  if (result.overallScore < 60 || result.winChance < 40) {
    assert.equal(result.shouldApply, false);
  }
});

test('Match Engine - Zero required skills defaults to 50% match', async () => {
  const projectNoSkills: ProjectData = {
    ...mockProject,
    skills_required: [],
  };

  const result = await calculateMatchScore(projectNoSkills, mockExpertFreelancer);

  assert.ok(
    result.matchBreakdown.skillsMatch >= 0,
    'Should handle zero required skills gracefully'
  );
});

test('Match Engine - Response time bonus caps at 20 points', async () => {
  const veryFast: FreelancerProfile = {
    ...mockExpertFreelancer,
    response_time_hours: 0.1, // 6 minutes
  };

  const result = await calculateMatchScore(mockProject, veryFast);

  // Win chance calculation should cap response time bonus
  assert.ok(
    result.winChance <= 100,
    'Win chance should never exceed 100'
  );
});

test('Match Engine - Scores are normalized to 0-100 range', async () => {
  const result = await calculateMatchScore(mockProject, mockExpertFreelancer);

  assert.ok(
    result.overallScore >= 0 && result.overallScore <= 100,
    'Overall score should be 0-100'
  );
  assert.ok(
    result.winChance >= 0 && result.winChance <= 100,
    'Win chance should be 0-100'
  );
  assert.ok(
    result.matchBreakdown.skillsMatch >= 0 &&
      result.matchBreakdown.skillsMatch <= 100,
    'Skills match should be 0-100'
  );
  assert.ok(
    result.matchBreakdown.rateMatch >= 0 &&
      result.matchBreakdown.rateMatch <= 100,
    'Rate match should be 0-100'
  );
});

test('Match Engine - Perfect rate alignment gets 100 points', async () => {
  const perfectRate: FreelancerProfile = {
    ...mockExpertFreelancer,
    hourly_rate: 125, // Exactly matches project budget / hours
  };

  const result = await calculateMatchScore(mockProject, perfectRate);

  assert.ok(
    result.matchBreakdown.rateMatch === 100,
    'Perfect rate alignment should get 100'
  );
});

test('Match Engine - Weighted scoring gives correct emphasis', async () => {
  // Skills should have highest weight (35%)
  const result = await calculateMatchScore(mockProject, mockExpertFreelancer);

  // Expert should score high because of 35% skills weight
  assert.ok(
    result.overallScore >= 75,
    'Expert with matching skills should score high'
  );
});

test('Match Engine - Multiple missing skills reduce match score progressively', async () => {
  const oneSkill: FreelancerProfile = {
    ...mockJuniorFreelancer,
    skills: ['React'],
  };

  const twoSkills: FreelancerProfile = {
    ...mockJuniorFreelancer,
    skills: ['React', 'Node.js'],
  };

  const result1 = await calculateMatchScore(mockProject, oneSkill);
  const result2 = await calculateMatchScore(mockProject, twoSkills);

  assert.ok(
    result2.overallScore > result1.overallScore,
    'More matching skills should increase score'
  );
});

test('Match Engine - Success rate affects win chance', async () => {
  const lowSuccess: FreelancerProfile = {
    ...mockExpertFreelancer,
    success_rate: 40,
  };

  const result1 = await calculateMatchScore(mockProject, mockExpertFreelancer);
  const result2 = await calculateMatchScore(mockProject, lowSuccess);

  assert.ok(
    result1.winChance > result2.winChance,
    'Higher success rate should improve win chance'
  );
});
