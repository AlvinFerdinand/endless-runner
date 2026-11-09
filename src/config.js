export const WORLD = Object.freeze({ width: 450, height: 800 });

export const LOOP = Object.freeze({ fixedTimeStep: 1 / 120 });

export const LANES = Object.freeze({ count: 3, width: 130, roadLeft: 30 });

export const PLAYER = Object.freeze({
  width: 70,
  height: 90,
  y: 660,
  switchDuration: 0.12,
  hitboxInset: 8,
});

export const OBSTACLE = Object.freeze({
  width: 92,
  height: 70,
  hitboxInset: 4,
  initialPoolSize: 24,
});

export const DIFFICULTY = Object.freeze({
  startSpeed: 320,
  maxSpeed: 900,
  speedGain: 12,
  startInterval: 1.2,
  minInterval: 0.42,
  intervalDecay: 0.012,
  doubleLaneStartChance: 0.1,
  doubleLaneMaxChance: 0.55,
  doubleLaneChanceGain: 0.008,
});

export const SPAWN = Object.freeze({
  y: -OBSTACLE.height,
  initialDelay: 0.8,
  reactionTime: 0.18,
});

export const SCORE = Object.freeze({ pointsPerSecond: 10 });

export const INPUT = Object.freeze({ swipeThreshold: 40 });
