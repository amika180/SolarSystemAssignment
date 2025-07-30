const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
scene.add(ambientLight, pointLight);

camera.position.z = 30;

const planetsData = [
  { name: 'Mercury', size: 0.3, orbit: 5, color: 0xaaaaaa, speed: 0.04 },
  { name: 'Venus', size: 0.6, orbit: 7, color: 0xffcc99, speed: 0.03 },
  { name: 'Earth', size: 0.65, orbit: 9, color: 0x3399ff, speed: 0.025 },
  { name: 'Mars', size: 0.5, orbit: 11, color: 0xff3300, speed: 0.02 },
  { name: 'Jupiter', size: 1.2, orbit: 14, color: 0xffcc66, speed: 0.015 },
  { name: 'Saturn', size: 1.1, orbit: 17, color: 0xffcc33, speed: 0.012 },
  { name: 'Uranus', size: 0.9, orbit: 20, color: 0x66ccff, speed: 0.01 },
  { name: 'Neptune', size: 0.85, orbit: 23, color: 0x3366ff, speed: 0.008 }
];

const planets = [];

const controlsDiv = document.getElementById('controls');
planetsData.forEach(data => {
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.x = data.orbit;

  const planet = {
    ...data,
    mesh,
    angle: Math.random() * Math.PI * 2
  };
  planets.push(planet);

  const label = document.createElement('label');
  label.innerText = data.name;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = 0;
  input.max = 0.1;
  input.step = 0.001;
  input.value = data.speed;
  input.oninput = (e) => planet.speed = parseFloat(e.target.value);
  controlsDiv.appendChild(label);
  controlsDiv.appendChild(document.createElement('br'));
  controlsDiv.appendChild(input);
  controlsDiv.appendChild(document.createElement('br'));
});

let isPaused = false;
document.getElementById('toggleAnimation').onclick = () => {
  isPaused = !isPaused;
  document.getElementById('toggleAnimation').innerText = isPaused ? "Resume" : "Pause";
};

function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    planets.forEach(p => {
      p.angle += p.speed;
      p.mesh.position.x = Math.cos(p.angle) * p.orbit;
      p.mesh.position.z = Math.sin(p.angle) * p.orbit;
    });
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
