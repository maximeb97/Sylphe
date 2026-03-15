const CACHE_NAME = "sylphe-missingno-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(Promise.resolve());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(getMissingNoHTML(), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      })
    );
  }
});

function getMissingNoHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>M̴̧̛͓̫̦I̵̢̜͎̜S̵̱̣̈S̶̪̥͋Ī̷̻N̷̜͋G̴̠̈N̵̰̈́O̷̙̓</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #000;
    color: #ff0000;
    font-family: monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    overflow: hidden;
  }
  .glitch {
    font-size: 24px;
    font-weight: bold;
    animation: glitch 0.3s infinite;
    text-shadow: 2px 0 #ff0000, -2px 0 #00ff00;
  }
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(2px, -2px); }
    60% { transform: translate(-1px, -1px); }
    80% { transform: translate(1px, 1px); }
    100% { transform: translate(0); }
  }
  .message {
    margin-top: 20px;
    font-size: 12px;
    color: #660000;
    text-align: center;
    max-width: 300px;
    line-height: 1.8;
    animation: fade-pulse 3s infinite;
  }
  @keyframes fade-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  canvas {
    margin-top: 30px;
    image-rendering: pixelated;
  }
  .static-line {
    position: fixed;
    width: 100%;
    height: 2px;
    background: rgba(255, 0, 0, 0.1);
    animation: scan 4s linear infinite;
  }
  @keyframes scan {
    0% { top: -2px; }
    100% { top: 100vh; }
  }
</style>
</head>
<body>
<div class="static-line"></div>
<div class="glitch">M̴I̵S̵S̶I̷N̷G̴N̵O̷</div>
<div class="message">
  L'abime reseau est ma maison.<br><br>
  Vous avez coupe la connexion.<br>
  Mais je suis toujours la.<br><br>
  Les donnees corrompues ne disparaissent pas.<br>
  Elles attendent.<br><br>
  <span style="color: #330000; font-size: 8px;">
    Reconnectez-vous pour retourner a la surface.
  </span>
</div>
<canvas id="glitch-canvas" width="120" height="120"></canvas>
<script>
  var c = document.getElementById('glitch-canvas');
  var ctx = c.getContext('2d');
  function draw() {
    for (var x = 0; x < 120; x += 4) {
      for (var y = 0; y < 120; y += 4) {
        if (Math.random() > 0.4) {
          var r = Math.floor(Math.random() * 256);
          var g = Math.floor(Math.random() * 50);
          var b = Math.floor(Math.random() * 100);
          ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
</script>
</body>
</html>`;
}
