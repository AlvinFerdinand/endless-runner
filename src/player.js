import { LANES, PLAYER } from './config.js';
import { insetRect } from './collision.js';
import { MIDDLE_LANE, laneCenterX } from './lanes.js';
import { clamp, moveTowards } from './utils/math.js';

const LANE_SWITCH_SPEED = LANES.width / PLAYER.switchDuration;

/**
 * The lane is the logical position and changes instantly on input; the drawn
 * position glides towards it. Collision uses the drawn position, so a player
 * caught mid-switch can still be hit.
 */
export class Player {
  constructor() {
    this.width = PLAYER.width;
    this.height = PLAYER.height;
    this.y = PLAYER.y;
    this.reset();
  }

  get rect() {
    return { x: this.centerX - this.width / 2, y: this.y, width: this.width, height: this.height };
  }

  get hitbox() {
    return insetRect(this.rect, PLAYER.hitboxInset);
  }

  reset() {
    this.lane = MIDDLE_LANE;
    this.centerX = laneCenterX(this.lane);
  }

  steer(direction) {
    this.lane = clamp(this.lane + direction, 0, LANES.count - 1);
  }

  update(dt) {
    this.centerX = moveTowards(this.centerX, laneCenterX(this.lane), LANE_SWITCH_SPEED * dt);
  }
}
