import { LANES, SPAWN } from './config.js';
import { laneCenterX } from './lanes.js';
import { randomInt } from './utils/math.js';

/** Emits rows of obstacles on a timer driven by the current difficulty. */
export class Spawner {
  constructor(pool) {
    this.pool = pool;
    this.reset();
  }

  reset() {
    this.cooldown = SPAWN.initialDelay;
  }

  update(dt, { spawnInterval, doubleLaneChance }, obstacles) {
    this.cooldown -= dt;
    if (this.cooldown > 0) return;

    this.spawnRow(doubleLaneChance, obstacles);
    this.cooldown += spawnInterval;
  }

  spawnRow(doubleLaneChance, obstacles) {
    for (const lane of pickBlockedLanes(doubleLaneChance)) {
      const obstacle = this.pool.acquire();
      obstacle.x = laneCenterX(lane) - obstacle.width / 2;
      obstacle.y = SPAWN.y;
      obstacles.push(obstacle);
    }
  }
}

/** One lane is always left open, so every row has an escape route. */
function pickBlockedLanes(doubleLaneChance) {
  const openLane = randomInt(LANES.count);
  const blockable = Array.from({ length: LANES.count }, (_, lane) => lane).filter(
    (lane) => lane !== openLane,
  );

  if (Math.random() < doubleLaneChance) return blockable;
  return [blockable[randomInt(blockable.length)]];
}
