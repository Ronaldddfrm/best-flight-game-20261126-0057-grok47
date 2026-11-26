export class HUD {
  constructor() {
    const panel = document.createElement('div');
    panel.style.cssText = 'position: absolute; top: 20px; left: 20px; background: rgba(10,20,40,0.8); padding: 15px; border: 2px solid #fff; color: #fff; font-family: monospace; pointer-events: none;';
    panel.innerHTML = `
      <div>Altitude: <span id="alt">0</span> ft</div>
      <div>Speed: <span id="speed">0</span> knots</div>
      <div>Heading: <span id="heading">0</span>°</div>
      <div>Throttle: <span id="throttle">0</span>%</div>
      <div>Score: <span id="score">0</span></div>
      <div>Rings: <span id="rings">0</span></div>
      <div>Time: <span id="time">120</span>s</div>
    `;
    document.body.appendChild(panel);
    this.elements = {
      alt: document.getElementById('alt'),
      speed: document.getElementById('speed'),
      heading: document.getElementById('heading'),
      throttle: document.getElementById('throttle'),
      score: document.getElementById('score'),
      rings: document.getElementById('rings'),
      time: document.getElementById('time'),
    };
  }
  update(altitude, speed, heading, throttle, score, rings, time) {
    this.elements.alt.textContent = Math.floor(altitude);
    this.elements.speed.textContent = Math.floor(speed);
    this.elements.heading.textContent = Math.floor(heading);
    this.elements.throttle.textContent = throttle;
    this.elements.score.textContent = score;
    this.elements.rings.textContent = rings;
    this.elements.time.textContent = Math.ceil(time);
  }
}
