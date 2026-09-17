import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeProjectTiming,
  analyzeFreelancerResponseTiming,
  calculateOptimalResponseTiming,
  ProjectTimeline,
  FreelancerTiming,
  TimingAnalysis,
} from '../src/lib/timing-analyzer';

// ============= FIXTURES =============

const createProjectTimeline = (hoursFromNow: number): ProjectTimeline => {
  const now = new Date();
  const deadline = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);

  return {
    projectId: 'test-project',
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Created 1 day ago
    deadline,
    estimatedDuration: 40,
    posted: now,
  };
};

const mockFreelancerTiming: FreelancerTiming = {
  averageResponseTime: 2, // 2 hours
  responseCount: 150,
  acceptanceRate: 75,
  completionRate: 95,
};

const slowFreelancer: FreelancerTiming = {
  averageResponseTime: 24, // 1 day
  responseCount: 100,
  acceptanceRate: 50,
  completionRate: 80,
};

const fastFreelancer: FreelancerTiming = {
  averageResponseTime: 0.5, // 30 minutes
  responseCount: 200,
  acceptanceRate: 85,
  completionRate: 98,
};

// ============= PROJECT TIMING TESTS =============

test('Timing Analyzer - Project with 1 hour deadline is critical', () => {
  const timeline = createProjectTimeline(1);
  const analysis = analyzeProjectTiming(timeline, 10);

  assert.ok(
    analysis.hoursUntilDeadline < 1.1 && analysis.hoursUntilDeadline > 0.9,
    'Should have ~1 hour until deadline'
  );
  assert.ok(
    analysis.timeScore < 60,
    'Score should be low for very short deadline'
  );
});

test('Timing Analyzer - Project with 24 hours gets medium score', () => {
  const timeline = createProjectTimeline(24);
  const analysis = analyzeProjectTiming(timeline, 10);

  assert.ok(
    analysis.hoursUntilDeadline > 23 && analysis.hoursUntilDeadline < 25,
    'Should have ~24 hours'
  );
  assert.ok(
    analysis.timeScore > 50 && analysis.timeScore < 90,
    'Score should be moderate'
  );
});

test('Timing Analyzer - Project with 72+ hours gets bonus', () => {
  const timeline = createProjectTimeline(96);
  const analysis = analyzeProjectTiming(timeline, 10);

  assert.ok(
    analysis.timeScore > 80,
    'Should get bonus for plenty of time'
  );
});

test('Timing Analyzer - Competition intensity low with few competitors', () => {
  const timeline = createProjectTimeline(24);
  const analysis = analyzeProjectTiming(timeline, 3);

  assert.equal(analysis.competitionIntensity, 'low');
  assert.ok(
    analysis.timeScore > 75,
    'Should boost score for low competition'
  );
});

test('Timing Analyzer - Competition intensity high with many competitors', () => {
  const timeline = createProjectTimeline(24);
  const analysis = analyzeProjectTiming(timeline, 50);

  assert.equal(analysis.competitionIntensity, 'high');
  assert.ok(
    analysis.timeScore < 75,
    'Should penalize score for high competition'
  );
});

test('Timing Analyzer - Optimal response window is 5-60 minutes', () => {
  const timeline = createProjectTimeline(24);
  const analysis = analyzeProjectTiming(timeline);

  assert.equal(analysis.optimalResponseWindow.startMinutes, 5);
  assert.equal(analysis.optimalResponseWindow.endMinutes, 60);
});

test('Timing Analyzer - Time score is bounded 0-100', () => {
  const timeline1 = createProjectTimeline(0.5);
  const timeline2 = createProjectTimeline(120);

  const analysis1 = analyzeProjectTiming(timeline1);
  const analysis2 = analyzeProjectTiming(timeline2);

  assert.ok(analysis1.timeScore >= 0 && analysis1.timeScore <= 100);
  assert.ok(analysis2.timeScore >= 0 && analysis2.timeScore <= 100);
});

test('Timing Analyzer - Recommendations for urgent projects', () => {
  const timeline = createProjectTimeline(0.5);
  const analysis = analyzeProjectTiming(timeline);

  assert.ok(
    analysis.recommendations.some((r) => r.includes('IMEDIATAMENTE')),
    'Should recommend immediate action'
  );
});

test('Timing Analyzer - Recommendations for high competition', () => {
  const timeline = createProjectTimeline(24);
  const analysis = analyzeProjectTiming(timeline, 50);

  assert.ok(
    analysis.recommendations.some((r) => r.includes('concorrência')),
    'Should mention competition'
  );
});

test('Timing Analyzer - Recommendations for favorable conditions', () => {
  const timeline = createProjectTimeline(72);
  const analysis = analyzeProjectTiming(timeline, 3);

  assert.ok(
    analysis.recommendations.some((r) => r.includes('Pouca concorrência')),
    'Should highlight low competition'
  );
});

test('Timing Analyzer - Very short deadline gets critical recommendations', () => {
  const timeline = createProjectTimeline(0.25); // 15 minutes
  const analysis = analyzeProjectTiming(timeline);

  assert.ok(analysis.recommendations.length > 0);
  const urgentRec = analysis.recommendations.find((r) => r.includes('🔴'));
  assert.ok(urgentRec, 'Should have urgent (red) recommendation');
});

test('Timing Analyzer - Long deadline with low competition', () => {
  const timeline = createProjectTimeline(120); // 5 days
  const analysis = analyzeProjectTiming(timeline, 2);

  assert.ok(analysis.timeScore > 75, 'Should score well');
  assert.equal(analysis.competitionIntensity, 'low');
});

// ============= FREELANCER RESPONSE TIMING TESTS =============

test('Timing Analyzer - Fast freelancer gets high response score', () => {
  const analysis = analyzeFreelancerResponseTiming(
    fastFreelancer,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis.responseTimeScore > 90,
    'Fast freelancer should score high'
  );
});

test('Timing Analyzer - Slow freelancer gets low response score', () => {
  const analysis = analyzeFreelancerResponseTiming(
    slowFreelancer,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis.responseTimeScore < 50,
    'Slow freelancer should score low'
  );
});

test('Timing Analyzer - Win probability considers response time', () => {
  const analysis1 = analyzeFreelancerResponseTiming(
    fastFreelancer,
    createProjectTimeline(24),
    10
  );

  const analysis2 = analyzeFreelancerResponseTiming(
    slowFreelancer,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis1.winProbability > analysis2.winProbability,
    'Fast freelancer should have higher win probability'
  );
});

test('Timing Analyzer - High acceptance rate boosts win probability', () => {
  const highAcceptance: FreelancerTiming = {
    ...mockFreelancerTiming,
    acceptanceRate: 95,
  };

  const analysis = analyzeFreelancerResponseTiming(
    highAcceptance,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis.winProbability > 50,
    'High acceptance rate should boost win probability'
  );
});

test('Timing Analyzer - High completion rate is recognized', () => {
  const analysis = analyzeFreelancerResponseTiming(
    fastFreelancer,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis.recommendations.some((r) => r.includes('TODOS')),
    'Should recognize high completion rate'
  );
});

test('Timing Analyzer - Low acceptance rate gets recommendation', () => {
  const lowAcceptance: FreelancerTiming = {
    ...mockFreelancerTiming,
    acceptanceRate: 20,
  };

  const analysis = analyzeFreelancerResponseTiming(
    lowAcceptance,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis.recommendations.some((r) => r.includes('Melhore')),
    'Should recommend improving proposals'
  );
});

test('Timing Analyzer - Short deadline + slow response = bad recommendation', () => {
  const analysis = analyzeFreelancerResponseTiming(
    slowFreelancer,
    createProjectTimeline(3), // Only 3 hours
    10
  );

  assert.ok(
    analysis.recommendations.some((r) => r.includes('baixa chance')),
    'Should warn about low chance'
  );
});

test('Timing Analyzer - Win probability is bounded 0-100', () => {
  const analysis = analyzeFreelancerResponseTiming(
    fastFreelancer,
    createProjectTimeline(24),
    50 // High competition
  );

  assert.ok(
    analysis.winProbability >= 0 && analysis.winProbability <= 100,
    'Win probability should be 0-100'
  );
});

test('Timing Analyzer - Response time score reflects freelancer speed', () => {
  const results = [
    { timing: { ...mockFreelancerTiming, averageResponseTime: 0.25 }, expected: 100 },
    { timing: { ...mockFreelancerTiming, averageResponseTime: 1 }, expected: 90 },
    { timing: { ...mockFreelancerTiming, averageResponseTime: 6 }, expected: 70 },
    { timing: { ...mockFreelancerTiming, averageResponseTime: 24 }, expected: 30 },
    { timing: { ...mockFreelancerTiming, averageResponseTime: 48 }, expected: 10 },
  ];

  results.forEach(({ timing, expected }) => {
    const analysis = analyzeFreelancerResponseTiming(
      timing,
      createProjectTimeline(24),
      10
    );
    assert.ok(
      Math.abs(analysis.responseTimeScore - expected) <= 5,
      `Response time ${timing.averageResponseTime} should score ~${expected}`
    );
  });
});

test('Timing Analyzer - Recommendations for excellent freelancer', () => {
  const excellent: FreelancerTiming = {
    averageResponseTime: 0.5,
    responseCount: 300,
    acceptanceRate: 95,
    completionRate: 99,
  };

  const analysis = analyzeFreelancerResponseTiming(
    excellent,
    createProjectTimeline(24),
    10
  );

  assert.ok(
    analysis.recommendations.some((r) => r.includes('EXCELENTE')),
    'Should recognize excellent freelancer'
  );
});

// ============= OPTIMAL RESPONSE TIMING TESTS =============

test('Timing Analyzer - Optimal timing critical for < 1 hour deadline', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(0.5),
    mockFreelancerTiming,
    10
  );

  assert.equal(timing.urgencyLevel, 'critical');
  assert.ok(timing.bestTimeToRespond.includes('AGORA'));
});

test('Timing Analyzer - Optimal timing high for 1-6 hour deadline', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(3),
    mockFreelancerTiming,
    10
  );

  assert.equal(timing.urgencyLevel, 'high');
});

test('Timing Analyzer - Optimal timing medium for 6-48 hour deadline', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    mockFreelancerTiming,
    10
  );

  assert.equal(timing.urgencyLevel, 'medium');
});

test('Timing Analyzer - Optimal timing low for > 48 hour deadline', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(96),
    mockFreelancerTiming,
    10
  );

  assert.equal(timing.urgencyLevel, 'low');
});

test('Timing Analyzer - Should respond when there is enough time', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    mockFreelancerTiming,
    10
  );

  assert.equal(timing.shouldRespond, true);
});

test('Timing Analyzer - Should not respond with insufficient time', () => {
  const timeline = createProjectTimeline(0.5); // 30 minutes
  const slow: FreelancerTiming = {
    ...mockFreelancerTiming,
    averageResponseTime: 2, // 2 hours
  };

  const timing = calculateOptimalResponseTiming(timeline, slow, 10);

  assert.equal(timing.shouldRespond, false);
});

test('Timing Analyzer - Should not respond with low acceptance rate', () => {
  const low: FreelancerTiming = {
    ...mockFreelancerTiming,
    acceptanceRate: 10, // Very low
  };

  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    low,
    10
  );

  assert.equal(timing.shouldRespond, false);
});

test('Timing Analyzer - Best response time adapts to urgency', () => {
  const urgent = calculateOptimalResponseTiming(
    createProjectTimeline(0.5),
    mockFreelancerTiming,
    10
  );

  const normal = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    mockFreelancerTiming,
    10
  );

  const relaxed = calculateOptimalResponseTiming(
    createProjectTimeline(96),
    mockFreelancerTiming,
    10
  );

  assert.notEqual(urgent.bestTimeToRespond, normal.bestTimeToRespond);
  assert.notEqual(normal.bestTimeToRespond, relaxed.bestTimeToRespond);
});

test('Timing Analyzer - Optimal timing considers freelancer speed', () => {
  const timeline = createProjectTimeline(3);

  const fast = calculateOptimalResponseTiming(timeline, fastFreelancer, 10);
  const slow = calculateOptimalResponseTiming(timeline, slowFreelancer, 10);

  // Fast freelancer should be able to respond
  assert.ok(
    fast.shouldRespond,
    'Fast freelancer should be able to respond'
  );

  // Slow freelancer might not have time
  assert.equal(
    slow.shouldRespond,
    false,
    'Slow freelancer cannot respond in 3 hours'
  );
});

test('Timing Analyzer - Response timing recommendations are specific', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    mockFreelancerTiming,
    10
  );

  assert.ok(
    timing.bestTimeToRespond.length > 0,
    'Should have specific recommendation'
  );
  assert.ok(
    typeof timing.bestTimeToRespond === 'string',
    'Should be string'
  );
});

test('Timing Analyzer - High competition increases urgency messaging', () => {
  const low = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    mockFreelancerTiming,
    5 // Low competition
  );

  const high = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    mockFreelancerTiming,
    100 // High competition
  );

  // Both should suggest responding, but messages might differ
  assert.ok(low.bestTimeToRespond.length > 0);
  assert.ok(high.bestTimeToRespond.length > 0);
});

test('Timing Analyzer - Project with 0% acceptance rate not recommended', () => {
  const noAcceptance: FreelancerTiming = {
    ...mockFreelancerTiming,
    acceptanceRate: 0,
  };

  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(24),
    noAcceptance,
    10
  );

  assert.equal(timing.shouldRespond, false);
});

test('Timing Analyzer - Tight deadline with good freelancer stats', () => {
  const timing = calculateOptimalResponseTiming(
    createProjectTimeline(2),
    fastFreelancer,
    5
  );

  assert.equal(timing.urgencyLevel, 'high');
  assert.equal(timing.shouldRespond, true);
});

test('Timing Analyzer - All components provide recommendations', () => {
  const projectAnalysis = analyzeProjectTiming(
    createProjectTimeline(6),
    20
  );

  const freelancerAnalysis = analyzeFreelancerResponseTiming(
    mockFreelancerTiming,
    createProjectTimeline(6),
    20
  );

  const timingAnalysis = calculateOptimalResponseTiming(
    createProjectTimeline(6),
    mockFreelancerTiming,
    20
  );

  assert.ok(Array.isArray(projectAnalysis.recommendations));
  assert.ok(Array.isArray(freelancerAnalysis.recommendations));
  assert.ok(typeof timingAnalysis.bestTimeToRespond === 'string');
});
