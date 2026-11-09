import { LANES, WORLD } from './config.js';

const COLORS = Object.freeze({
  background: '#121826',
  road: '#1b2333',
  roadEdge: '#4a5670',
  laneMark: 'rgba(245, 241, 232, 0.25)',
  player: '#f2b33d',
  playerWindow: '#10151f',
  obstacle: '#e85d4a',
  obstacleShade: '#b8473a',
  text: '#f5f1e8',
});

const HUD_FONT = '600 24px system-ui, sans-serif';
const LANE_DASH = Object.freeze([40, 40]);
const LANE_DASH_PERIOD = LANE_DASH[0] + LANE_DASH[1];
const ROAD_WIDTH = LANES.width * LANES.count;
const OBSTACLE_SHADE_HEIGHT = 12;

export class Renderer {
  constructor(context) {
    this.ctx = context;
  }

  render(game) {
    this.drawBackground();
    this.drawRoad(game.distance);
    this.drawObstacles(game.obstacles);
    this.drawPlayer(game.player.rect);
    this.drawHud(game);
  }

  drawBackground() {
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  }

  /** Lane markings scroll with travelled distance to convey speed. */
  drawRoad(distance) {
    const { ctx } = this;
    ctx.fillStyle = COLORS.road;
    ctx.fillRect(LANES.roadLeft, 0, ROAD_WIDTH, WORLD.height);

    this.drawVerticalLine(LANES.roadLeft, COLORS.roadEdge);
    this.drawVerticalLine(LANES.roadLeft + ROAD_WIDTH, COLORS.roadEdge);

    ctx.setLineDash(LANE_DASH);
    ctx.lineDashOffset = -(distance % LANE_DASH_PERIOD);
    for (let lane = 1; lane < LANES.count; lane++) {
      this.drawVerticalLine(LANES.roadLeft + LANES.width * lane, COLORS.laneMark);
    }
    ctx.setLineDash([]);
  }

  drawObstacles(obstacles) {
    const { ctx } = this;

    for (const { x, y, width, height } of obstacles) {
      ctx.fillStyle = COLORS.obstacle;
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = COLORS.obstacleShade;
      ctx.fillRect(x, y + height - OBSTACLE_SHADE_HEIGHT, width, OBSTACLE_SHADE_HEIGHT);
    }
  }

  drawPlayer({ x, y, width, height }) {
    const { ctx } = this;
    ctx.fillStyle = COLORS.player;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = COLORS.playerWindow;
    ctx.fillRect(x + 10, y + 14, width - 20, height * 0.25);
  }

  drawHud({ score, elapsed }) {
    const { ctx } = this;
    ctx.font = HUD_FONT;
    ctx.textBaseline = 'top';
    ctx.fillStyle = COLORS.text;

    ctx.textAlign = 'left';
    ctx.fillText(`Skor ${score}`, 24, 20);
    ctx.textAlign = 'right';
    ctx.fillText(`${elapsed.toFixed(1)} dtk`, WORLD.width - 24, 20);
  }

  drawVerticalLine(x, color) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD.height);
    ctx.stroke();
  }
}
