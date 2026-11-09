import { LANES } from './config.js';

export const MIDDLE_LANE = Math.floor(LANES.count / 2);

export const laneCenterX = (lane) => LANES.roadLeft + LANES.width * (lane + 0.5);
