import { OBSTACLE, SCORE, WORLD } from './config.js';
import { insetRect, rectsOverlap } from './collision.js';
import { difficultyAt } from './difficulty.js';
import { Player } from './player.js';
import { Pool } from './pool.js';
import { Spawner } from './spawner.js';

export const GameState = Object.freeze({
  IDLE: 'idle',
  PLAYING: 'playing',
  OVER: 'over',
});

const createObstacle = () => ({ x: 0, y: 0, width: OBSTACLE.width, height: OBSTACLE.height });

/**
 * Owns all gameplay state and rules. It knows nothing about rendering or DOM
 * input; callers feed it steer commands and a fixed time step.
 */
export class Game {
  constructor({ onGameOver }) {
    this.onGameOver = onGameOver;
    this.state = GameState.IDLE;
    this.player = new Player();
    this.obstacles = [];
    this.pool = new Pool(createObstacle, OBSTACLE.initialPoolSize);
    this.spawner = new Spawner(this.pool);
    this.reset();
  }

  get score() {
    return Math.floor(this.elapsed * SCORE.pointsPerSecond);
  }

  start() {
    this.reset();
    this.state = GameState.PLAYING;
  }

  reset() {
    for (const obstacle of this.obstacles) this.pool.release(obstacle);
    this.obstacles.length = 0;
    this.elapsed = 0;
    this.distance = 0;
    this.player.reset();
    this.spawner.reset();
  }

  steer(direction) {
    if (this.state === GameState.PLAYING) this.player.steer(direction);
  }

  update(dt) {
    if (this.state !== GameState.PLAYING) return;

    this.elapsed += dt;
    const difficulty = difficultyAt(this.elapsed);
    const travel = difficulty.speed * dt;
    this.distance += travel;

    this.player.update(dt);
    this.spawner.update(dt, difficulty, this.obstacles);
    this.moveObstacles(travel);

    if (this.isPlayerHit()) this.finish();
  }

  /** Obstacles share one world speed, so the spacing between rows never shrinks after spawning. */
  moveObstacles(travel) {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.y += travel;

      if (obstacle.y > WORLD.height) {
        this.obstacles.splice(i, 1);
        this.pool.release(obstacle);
      }
    }
  }

  isPlayerHit() {
    const hitbox = this.player.hitbox;
    return this.obstacles.some((obstacle) =>
      rectsOverlap(hitbox, insetRect(obstacle, OBSTACLE.hitboxInset)),
    );
  }

  finish() {
    this.state = GameState.OVER;
    this.onGameOver({ score: this.score, survivedSeconds: this.elapsed });
  }
}
