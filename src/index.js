import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  Color,
  HemisphereLight,
  DirectionalLight,
  ShaderMaterial,
  Clock,
  FontLoader,
  TextBufferGeometry,
  MeshBasicMaterial,
  SphereGeometry,
  BoxGeometry,
  TetrahedronGeometry,
  DodecahedronGeometry,
} from "three";
import curDot from "cursor-dot";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
  "appvMjgA3Di00eDev"
);

let btnElement = document.getElementById("next");
let initTextSize = 0.7;
let initTxtSize2 = 0.16;
let yPosShift = 0;
let kick = 0;
let dancePos = -1.2;
let enterTxt = -1.3;
let titleTxt = 1;
let sub = 0;
let enterSize = 0.09;

let geometryBall = new SphereGeometry(0.5, 8, -30);
let geometries = [
  new SphereGeometry(0.5, 8, -30),
  new SphereGeometry(0.5, 16, 16),
  new BoxGeometry(0.5, 0.5, 0.5),
  new TetrahedronGeometry(0.5),
  new DodecahedronGeometry(0.5),
  new BoxGeometry(0.5, 0.5, 0.5),
];

if (window.innerWidth < 750) {
  btnElement = document.getElementById("next-phone");
  initTextSize = 0.28;
  initTxtSize2 = 0.14;
  yPosShift = 0.8;
  kick = -0.1;
  geometryBall = new SphereGeometry(0.7, 8, -30);
  geometries = [
    new SphereGeometry(0.7, 8, -30),
    new SphereGeometry(0.7, 16, 16),
    new BoxGeometry(0.7, 0.7, 0.7),
    new TetrahedronGeometry(0.7),
    new DodecahedronGeometry(0.7),
    new BoxGeometry(0.7, 0.7, 0.7),
  ];
  dancePos = -2;
  enterTxt = -2.3;
  titleTxt = 1.5;
  sub = 0.5;
  enterSize = 0.12;
}

let uniforms,
  container,
  scene,
  camera,
  renderer,
  mesh,
  mesh2,
  mesh3,
  geometry,
  geometry2,
  geometry3,
  clock,
  repoData,
  material,
  time,
  record,
  pIndex;
let globalString, globalSubtitle, globalURL, sphere, bgImg;
let enterString = "Welcome";
let myCoolBool = false;
let colors = ["#000000", "#A55C1B", "#702963", "#097969", "#517FA4", "#141245"];
const cursor = curDot({
  diameter: 40,
  easing: 4,
  background: "#fff",
});

cursor.classList.add("cursor-class");

function init() {
  container = document.querySelector(".container");
  scene = new Scene();
  clock = new Clock();
  time = 0;
  const spinner = document.getElementById("spinner");

  function hideSpinner() {
    spinner.classList.add("hide");
  }
  base("Work")
    .select({
      view: "Grid view",
    })
    .eachPage(
      function page(records) {
        repoData = records;
        pIndex = repoData.findIndex(
          (x) => x.fields["Project Name"] === "Isaac Sante"
        );
        record = repoData[pIndex];
        globalString = record.fields["Project Name"];
        globalSubtitle = record.fields.Subtitle;
        globalURL = "info.html";
        bgImg = record.fields.Img1[0].url;
        document.getElementById("background-img").src = bgImg;
        document.getElementById("second-background-img").src = bgImg;
        createGeometry();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );

  createRenderer();
  createCamera();
  hideSpinner();
  createLights();
  createDance();
}

function createCamera() {
  const aspect = container.clientWidth / container.clientHeight;
  camera = new PerspectiveCamera(100, aspect, 0.1, 1000);
  camera.position.set(0, -0.5, 3);
}

function createLights() {
  const directionalLight = new DirectionalLight(0xffffff, 5);
  directionalLight.position.set(5, 5, 10);
  const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
  scene.add(directionalLight, hemisphereLight);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function createGeometry() {
  var loader = new FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      geometry = new TextBufferGeometry(globalString, {
        font: font,
        size: initTextSize,
        height: 0,
      });
      geometry.center();
      geometry.translate(0, titleTxt + yPosShift, -0.3);

      geometry2 = new TextBufferGeometry(globalSubtitle, {
        font: font,
        size: initTxtSize2,
        height: 0,
      });

      geometry2.center();
      geometry2.translate(0, sub + yPosShift + 3.5 * (kick * -1), -0.3);
      geometry3 = new TextBufferGeometry(enterString, {
        font: font,
        size: enterSize,
        height: 0,
      });

      geometry3.center();
      geometry3.translate(0, enterTxt + yPosShift, -0.2);

      uniforms = {
        uTime: { value: 0.0 },
        u_resolution: { value: { x: null, y: null } },
        colorA: { type: "vec3", value: new Color(0x74ebd5) },
        colorB: { type: "vec3", value: new Color(0xacb6e5) },
      };

      material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        opacity: 0.5,
        transparent: true,
      });

      mesh = new Mesh(geometry, material);
      mesh2 = new Mesh(geometry2, material);
      mesh3 = new Mesh(geometry3, material);
      scene.add(mesh);
      scene.add(mesh2);
      scene.add(mesh3);
      myCoolBool = true;
    }
  );
}

function createDance() {
  geometryBall.center();
  let material1 = new MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  sphere = new Mesh(geometryBall, material1);
  sphere.name = "Spheres";
  scene.add(sphere);
  sphere.position.z = 0.2;
  sphere.position.y = dancePos + yPosShift + kick;
}

btnElement.addEventListener("click", () => {
  pIndex = (pIndex + 1) % repoData.length;
  document.getElementsByTagName("body")[0].style.backgroundColor =
    colors[pIndex];
  record = repoData[pIndex];
  if (pIndex > 0) {
    enterString = "Enter";
    globalURL = "content.html?" + record.fields.Slug;
  } else {
    enterString = "Welcome";
    globalURL = "info.html";
  }
  scene.remove(mesh);
  scene.remove(mesh2);
  scene.remove(mesh3);
  globalString = record.fields["Project Name"];
  globalSubtitle = record.fields.Subtitle;
  bgImg = record.fields.Img1[0].url;
  document.getElementById("background-img").src = bgImg;
  document.getElementById("second-background-img").src = bgImg;
  createGeometry();
  scene.remove(sphere);
  geometryBall = geometries[pIndex];
  createDance();
});

init();

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  if (myCoolBool == true) {
    mesh.material.uniforms.uTime.value = Math.cos(clock.getElapsedTime());
  }
  sphere.rotation.y += 0.015;
});

let canvasElement = document.getElementById("container");
if (canvasElement) {
  canvasElement.addEventListener("click", () => {
    window.location.href = globalURL;
  });
}

window.addEventListener("resize", resize);

function resize() {
  if (window.innerWidth < 700) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.position.z = innerWidth / 50;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  } else {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.position.z = 3;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}
