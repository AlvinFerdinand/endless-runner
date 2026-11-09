import { loadBestScore, saveBestScore } from './best-score.js';
import { LOOP, WORLD } from './config.js';
import { GameLoop } from './core/game-loop.js';
import { LaneInput } from './core/lane-input.js';
import { Viewport } from './core/viewport.js';
import { Game } from './game.js';
import { Overlay } from './overlay.js';
import { Renderer } from './renderer.js';

const canvas = document.getElementById('game');
const viewport = new Viewport(canvas, WORLD);
const renderer = new Renderer(viewport.context);
const overlay = new Overlay(document.querySelector('[data-overlay]'));
const game = new Game({ onGameOver: showResult });
let bestScore = loadBestScore();

new LaneInput(canvas, (x, y) => viewport.toWorld(x, y), {
  worldWidth: WORLD.width,
  onSteer: (direction) => game.steer(direction),
});

new GameLoop({
  fixedTimeStep: LOOP.fixedTimeStep,
  update: (dt) => game.update(dt),
  render: () => renderer.render(game),
}).start();

showIntro();

function startRun() {
  overlay.hide();
  game.start();
}

function showIntro() {
  overlay.show({
    title: 'Endless Runner',
    lines: [
      'Geser atau ketuk sisi kiri/kanan layar untuk pindah jalur.',
      'Di keyboard gunakan tombol panah atau A/D.',
      'Hindari rintangan selama mungkin.',
    ],
    actionLabel: 'Mulai',
    onAction: startRun,
  });
}

function showResult({ score, survivedSeconds }) {
  const isNewBest = score > bestScore;
  if (isNewBest) {
    bestScore = score;
    saveBestScore(bestScore);
  }

  overlay.show({
    title: isNewBest ? 'Rekor Baru!' : 'Tertabrak!',
    lines: [
      `Skor: ${score}`,
      `Bertahan: ${survivedSeconds.toFixed(1)} detik`,
      `Rekor: ${bestScore}`,
    ],
    actionLabel: 'Main Lagi',
    onAction: startRun,
  });
}
