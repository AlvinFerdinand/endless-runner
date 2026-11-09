import { DIFFICULTY, LANES, OBSTACLE, PLAYER, SPAWN } from './config.js';

/**
 * Difficulty is a pure function of survival time: obstacles get faster, rows
 * spawn more often and two-lane blocks become more common.
 */
export function difficultyAt(elapsed) {
  const speed = Math.min(DIFFICULTY.startSpeed + DIFFICULTY.speedGain * elapsed, DIFFICULTY.maxSpeed);
  const interval = Math.max(
    DIFFICULTY.startInterval - DIFFICULTY.intervalDecay * elapsed,
    DIFFICULTY.minInterval,
  );

  return {
    speed,
    spawnInterval: Math.max(interval, minimumFairInterval(speed)),
    doubleLaneChance: Math.min(
      DIFFICULTY.doubleLaneStartChance + DIFFICULTY.doubleLaneChanceGain * elapsed,
      DIFFICULTY.doubleLaneMaxChance,
    ),
  };
}

/**
 * The shortest gap between rows that still lets the player react and cross
 * from one edge lane to the other. Without this floor, high speeds could
 * produce consecutive rows that are impossible to dodge.
 */
function minimumFairInterval(speed) {
  const clearanceTime = (OBSTACLE.height + PLAYER.height) / speed;
  const maneuverTime = (LANES.count - 1) * PLAYER.switchDuration + SPAWN.reactionTime;
  return clearanceTime + maneuverTime;
}
