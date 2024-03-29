import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import nebula from './assets/images/nebula.jpg';
import stars from './assets/images/stars.jpg';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

// Import 3d model
const monkeyUrl = new URL('./assets/monkey.glb', import.meta.url);

// Create scene
const scene = new THREE.Scene();

// Add fog to the scene
scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);

// Add background image to the scene
const textureLoader = new THREE.TextureLoader()
scene.background = textureLoader.load(nebula);

const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//   nebula,
//   nebula,
//   stars,
//   stars,
//   stars,
//   stars,
// ]);

// Create camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer();

renderer.shadowMap.enabled = true;

const orbit = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

//Create directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 10);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 50, 0);
directionalLight.shadow.camera.bottom = -12;
directionalLight.shadow.camera.top = 12;
scene.add(directionalLight);

// Directiona light helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(dLightHelper)

// Directional light shadow helper
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper)

// Create spot light
const spotLight = new THREE.SpotLight(0xFFFFFF,1000);
spotLight.position.set(-20, 20, 0)
spotLight.castShadow = true;
spotLight.angle = 0.4;
scene.add(spotLight);

// Spotlight helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// Create cube geometry and material
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create cube with texture
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({ 
  // color: 0x00FF00,
  map: textureLoader.load(nebula),
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula),}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula),}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars),}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula),}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars),}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula),})
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
box2.position.set(10,2,10)
scene.add(box2);

// Create plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xFFFFFF,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(4);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x2e56db,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.y = 10
scene.add(sphere);

// Add grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

camera.position.y = 20;
camera.position.x = 20
orbit.update();

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();


// Create sphere with shaders
const vShader = 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const fShader = 'void main() { gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0); }'

const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);


const assetLoader = new GLTFLoader();
assetLoader.load(monkeyUrl.href, function (gltf) {
  const model = gltf.scene;
  scene.add(model);
  model.position.set(-12, 4, 10);
}, undefined, function (error) {
  console.error(error);
});

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  // rayCaster.setFromCamera(mousePosition, camera);
  // const intersects = rayCaster.intersectObject(scene.children);
  // console.log(intersects)

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});