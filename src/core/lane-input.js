import { INPUT } from '../config.js';

const KEY_DIRECTIONS = Object.freeze({
  ArrowLeft: -1,
  ArrowRight: 1,
  a: -1,
  A: -1,
  d: 1,
  D: 1,
});

/**
 * Turns pointer and keyboard input into steer directions (-1 or 1).
 * A horizontal swipe steers as soon as it passes the threshold, so it feels
 * immediate; a touch that never becomes a swipe acts as a tap on its side of
 * the screen.
 */
export class LaneInput {
  constructor(element, toWorld, { worldWidth, onSteer }) {
    this.element = element;
    this.toWorld = toWorld;
    this.worldWidth = worldWidth;
    this.onSteer = onSteer;
    this.pointerId = null;
    this.startX = 0;
    this.hasSwiped = false;

    element.addEventListener('pointerdown', (event) => this.handlePointerDown(event));
    element.addEventListener('pointermove', (event) => this.handlePointerMove(event));
    element.addEventListener('pointerup', (event) => this.handlePointerUp(event));
    element.addEventListener('pointercancel', (event) => this.handlePointerCancel(event));
    element.addEventListener('contextmenu', (event) => event.preventDefault());
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  handlePointerDown(event) {
    if (this.pointerId !== null || !event.isPrimary || event.button !== 0) return;

    event.preventDefault();
    this.element.setPointerCapture(event.pointerId);
    this.pointerId = event.pointerId;
    this.startX = this.worldX(event);
    this.hasSwiped = false;
  }

  handlePointerMove(event) {
    if (!this.isTracking(event) || this.hasSwiped) return;

    const deltaX = this.worldX(event) - this.startX;
    if (Math.abs(deltaX) < INPUT.swipeThreshold) return;

    this.hasSwiped = true;
    this.onSteer(Math.sign(deltaX));
  }

  handlePointerUp(event) {
    if (!this.isTracking(event)) return;

    if (!this.hasSwiped) this.onSteer(this.startX < this.worldWidth / 2 ? -1 : 1);
    this.release();
  }

  handlePointerCancel(event) {
    if (this.isTracking(event)) this.release();
  }

  handleKeyDown(event) {
    const direction = KEY_DIRECTIONS[event.key];
    if (!direction || event.repeat) return;

    event.preventDefault();
    this.onSteer(direction);
  }

  isTracking(event) {
    return event.pointerId === this.pointerId;
  }

  release() {
    if (this.element.hasPointerCapture(this.pointerId)) {
      this.element.releasePointerCapture(this.pointerId);
    }
    this.pointerId = null;
  }

  worldX(event) {
    return this.toWorld(event.clientX, event.clientY).x;
  }
}
