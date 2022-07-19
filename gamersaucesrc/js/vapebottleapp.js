import * as THREE from '../js/three.module.js';
import { OrbitControls } from '../js/OrbitControls.js';
import { DRACOLoader } from '../js/DRACOLoader.js';
import { GLTFLoader } from '../js/GLTFLoader.js';
import { RGBELoader } from '../js/RGBELoader.js';
//If imports arent'working change to exact links on everything

const canvas = document.querySelector("#bottle_3D");
const icon = document.createElement('img');
const progressLoader = document.getElementById("progressLoader");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const texturePath = canvas.dataset.texture;
console.log(texturePath);
let _gltf, labelRoughness,labelNormal, labelMetalness, labelMaterial, camera, scene, loadingManager, loader, mesh;


checkFileandContainer(texturePath, canvas);

function checkFileandContainer(filePath, container) {

  if (webglSupport() == false|| filePath === "" || container === "") {
    console.error("Browser doesn't support WebGL so can't render or you haven't provided correct strings");
  }
  else if (checkFileExtension(filePath) === false) {
    console.error("Incorrect image file format provided");
  }
  else if (checkImageExists(filePath) === false) {
    console.error("Texture image doesn't load or you have an incorrect link");
  }
  else if (canvas === null) {
    console.log("No canvas is currently present on the page please add it to the DOM");
    return;
  }
  else {
    init(filePath);
  }
}

//Setup material object
function returnLabelMaterialObject(productLabelPath) {

  const labelTexture = loader.load(productLabelPath);
  labelTexture.encoding = THREE.sRGBEncoding;

  labelMaterial = new THREE.MeshPhysicalMaterial({ map: labelTexture });
  labelMaterial.alphaMap = null;
  labelMaterial.aoMap = null;
  labelMaterial.aoMapIntensity = 1;
  labelMaterial.attenuationColor = 0;
  labelMaterial.attenuationDistance = 0;
  labelMaterial.blendDst = 205;
  labelMaterial.blendEquation = 100;
  labelMaterial.blending = 1;
  labelMaterial.blendSrc = 204;
  labelMaterial.clearcoat = null;
  labelMaterial.clearcoatMap = null;
  labelMaterial.clearcoatNormalMap = null;
  labelMaterial.clearcoatNormalScale = new THREE.Vector2(1, 1);
  labelMaterial.clearcoatRoughness = 0.030000001192092896;
  labelMaterial.defines = { STANDARD: '', PHYSICAL: '' };
  labelMaterial.depthFunc = 3;
  labelMaterial.displacementMap = null;
  labelMaterial.displacementScale = 1;
  labelMaterial.displacementBias = 0;
  labelMaterial.dithering = false;
  labelMaterial.emissive = new THREE.Color("rgb(0,0,0)");
  labelMaterial.emissiveMap = null;
  labelMaterial.emissiveIntensity = 1;
  labelMaterial.envMap = null;
  labelMaterial.envMapIntensity = 1;
  labelMaterial.flatShading = false;
  labelMaterial.fog = true;
  labelMaterial.ior = 1.5;
  labelMaterial.isMaterial = true;
  labelMaterial.isMeshPhysicalMaterial = true;
  labelMaterial.isMeshStandardMaterial = true;
  labelMaterial.lightMap = null;
  labelMaterial.lightMapIntensity = 1;
  labelMaterial.map.flipY = false;
  labelMaterial.metalness = 0;
  labelMaterial.metalnessMap = labelMetalness;
  labelMaterial.normalMap = labelNormal;
  labelMaterial.normalMapType = 0;
  labelMaterial.normalScale = new THREE.Vector2(1, 1);
  labelMaterial.opacity = 1;
  labelMaterial.reflectivity = null;
  labelMaterial.roughness = 0.8999999761581421;
  labelMaterial.roughnessMap = labelRoughness;
  labelMaterial.sheen = null;
  labelMaterial.sheenRoughness = 1;
  labelMaterial.sheenRoughnessMap = null;
  labelMaterial.sheenColor = new THREE.Color("rgb(0,0,0)");
  labelMaterial.sheenColorMap = null;
  labelMaterial.specularIntensity = 0.1;
  labelMaterial.specularIntensityMap = null;
  labelMaterial.specularColor = new THREE.Color("rgb(1,1,1)");
  labelMaterial.specularColorMap = null;
  labelMaterial.thickness = 0;
  labelMaterial.thicknessMap = null;
  labelMaterial.transmission = 0;
  labelMaterial.transmissionMap = null;
  labelMaterial.transparent = false;
  labelMaterial.visible = true;
  labelMaterial.wireframe = false;
  labelMaterial.wireframeLinecap = "round";
  labelMaterial.wireframeLinejoin = "round";
  labelMaterial.wireframeLinewidth = 1;
  labelMaterial.needsUpdate = true;
  return labelMaterial;

}

function init(productLabelPath) {

  loadingManager = new THREE.LoadingManager();

  loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };
  loadingManager.onProgress = function(url, itemsLoaded, itemsTotal){
    progressLoader.max = itemsTotal;
    progressLoader.value = itemsLoaded;
  
  };
  loadingManager.onLoad = function () {
    let progressLabel = document.getElementById("progressLoader_label");
    progressLabel.style.visibility = "hidden";
    progressLoader.style.visibility="hidden";
    console.log('Loading complete!');
    onWindowResize();
    //document.getElementById('bottle_3D_Loading').style.display = "none"; 
    document.getElementById('bottle_3D').style.visibility = "initial";
    create3dviewIcon();

    document.getElementById("bottle_3D").addEventListener("pointerenter", function (e) {
      icon.style.visibility = "hidden";
      icon.style.opacity = 0;
      icon.style.transition = "visibility 0s 0.3s, opacity 0.3s linear";
    });
    document.getElementById("bottle_3D").addEventListener("pointerleave", function (e) {
      icon.style.visibility = "visible";
      icon.style.opacity = 1;
      icon.style.transition = "opacity 0.3s linear";
    });
  };

  loader = new THREE.TextureLoader(loadingManager);
  labelRoughness = loader.load('../gamersaucesrc/GamerSauceCompressed/textures/plastic_Mat_metallic_png-plastic_Mat_roughness.png');
  labelNormal = loader.load('../gamersaucesrc/GamerSauceCompressed/textures/paper_Mat_normal.png');
  labelMetalness = loader.load('../gamersaucesrc/GamerSauceCompressed/textures/paper_Mat_metallic.png');

  labelRoughness.encoding = THREE.sRGBEncoding;
  labelNormal.encoding = THREE.sRGBEncoding;
  labelMetalness.encoding = THREE.sRGBEncoding;

  const labelTexture = loader.load(productLabelPath);
  labelTexture.encoding = THREE.sRGBEncoding;

  labelMaterial = returnLabelMaterialObject(productLabelPath, loader);


  camera = new THREE.PerspectiveCamera(45,0, 0.1, 200);
  camera.position.set(0, 0, 30);
  camera.position.z = 20;
  camera.position.y = 0;
  camera.position.x = 0;

  scene = new THREE.Scene();

  new RGBELoader(loadingManager).setPath('../gamersaucesrc/GamerSauceCompressed/textures/').load('nad.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = new THREE.Color(0xffffff);
    scene.environment = texture;
    
  });

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('../gamersaucesrc/js/draco/');
  dracoLoader.setDecoderConfig({ type: 'js' });

  const modelLoader = new GLTFLoader(loadingManager);
  modelLoader.setPath('../gamersaucesrc/GamerSauceCompressed/');
  modelLoader.setDRACOLoader(dracoLoader);
  let threeObjectLoader = new THREE.ObjectLoader();
  modelLoader.load('gamersauce3.gltf', function (gltf) {



    _gltf = gltf;
    mesh = gltf.scene;

    mesh.position.set(0, -5.1, 0);
    mesh.getObjectByName('label').material = labelMaterial;
    mesh.needsUpdate = true;
    scene.add(mesh);
    
  });

  modelLoader.on;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.autoClear = false;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.minDistance = 3;
  controls.maxDistance = 25;
  controls.target.set(0, 0, 0);
  controls.update();

  window.addEventListener('resize', onWindowResize);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function onWindowResize() {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  render();
}

function render() {

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  camera.lookAt(scene.position);
  renderer.render(scene, camera);

}

function webglSupport() {
  try {
    var canvas = document.createElement('canvas');
    return !!window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
}

function checkFileExtension(url) {
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function checkImageExists(url, timeoutT) {
  return new Promise(function (resolve, reject) {
    var timeout = timeoutT || 5000;
    var timer, img = new Image();
    img.onerror = img.onabort = function () {
      clearTimeout(timer);
      reject("error");
    };
    img.onload = function () {
      clearTimeout(timer);
      resolve("success");
    };
    timer = setTimeout(function () {
      img.src = "//!!!!/test.jpg";
      reject("timeout");
    }, timeout);
    img.src = url;
  });
}

function create3dviewIcon(){
  var parentElement = document.getElementById('progressLoader_label').parentElement;
  icon.src = './img/3dviewcubegbw.png';
  icon.style.width = '13%';
  icon.style.position = 'absolute';
  icon.style.bottom = '30%';
  icon.style.right = '5%';
  icon.style.cursor = 'default';
  icon.style.zIndex = '100';
  parentElement.appendChild(icon);
}

function updateLabelOnBottle(LabelURL) {
  mesh.getObjectByName('label').material = returnLabelMaterialObject(LabelURL);
  scene.add(_gltf.scene);
}

document.getElementById("labelSelect").addEventListener("change", function (e) {
  updateLabelOnBottle(e.currentTarget.value);
}, false);


