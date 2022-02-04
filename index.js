var loadingScreenDiv = window.document.getElementById("loadingScreen");
var btnEnter = document.getElementById("btnEnter");
// Loading still in progress.
// To wait for it to complete, add "DOMContentLoaded" or "load" listeners.
window.addEventListener("DOMContentLoaded", () => {
  // DOM ready! Images, frames, and other subresources are still downloading.
  document.getElementById("gauge").classList.add("inter");
});

window.addEventListener("load", () => {
  // Fully loaded!
  setTimeout(function () {
    document.getElementById("gauge").classList.add("done");
    document.getElementById("status").style.display = "none";
    document.getElementById("btnEnter").style.display = "block";
  }, 8000)
  setTimeout(function () {
    loadingScreenDiv.classList.add("disapear");
  }, 15000);

  var swiper = new Swiper(".mySwiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});


btnEnter.addEventListener("click", () => {
  loadingScreenDiv.classList.add("disapear");
})

var btnServiceInfo = document.getElementById("serviceInfo");
var serviceInfoCont = document.getElementById("serviceInfoContainer");
var canvas = document.getElementById("renderCanvas");

btnServiceInfo.addEventListener("click", function () {
  dimLayer.classList.add("show");
  serviceInfoCont.classList.add("show");
});

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};



var createScene = function () {
  BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (loader) {
    if (loader.name === "gltf") {
      loader.useRangeRequests = true;
    }
  });

  // Scene and Camera
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("main camera", 1.6, 1.13, 12.5, new BABYLON.Vector3(0, 0, 0), scene);
  scene.activeCamera = camera;
  scene.activeCamera.attachControl(canvas, true);
  // scene.debugLayer.show();
  // define degree
  var deg = Math.PI / 2;
  var deg1 = deg / 90;

  // camera
  camera.minZ = 1;
  camera.maxZ = 30000;
  camera.lowerBetaLimit = 0.9;
  camera.upperBetaLimit = 1.3;
  camera.angularSensibilityX = 5000;
  camera.lowerRadiusLimit = 150;
  camera.upperRadiusLimit = 410;
  camera.panningDistanceLimit = 1;
  camera.wheelPrecision = 1;
  camera.pinchPrecision = 0.5;
  camera.pinchZoom = true;
  camera.setPosition(new BABYLON.Vector3(800, 300, 0));
  camera.attachControl(canvas, true, false, 3);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.inputs.attached.mousewheel.wheelPrecisionY = 100;

  // Lights
  var light = new BABYLON.DirectionalLight("dirlight", new BABYLON.Vector3(-1, -1, 0), scene);
  light.position = new BABYLON.Vector3(0, 200, 0);
  light.intensity = 1.5;

  var light2 = new BABYLON.HemisphericLight("hemislight", new BABYLON.Vector3(0, 1, 0), scene);
  light2.intensity = 1.3;
  light2.specular = BABYLON.Color3.Black();

  var text = "오늘의 공연";
  var text2 = "진행예정";

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  //Set width an height for plane
  var planeWidth = 10;
  var planeHeight = 3;
  //Create plane
  var plane = BABYLON.MeshBuilder.CreatePlane("plane", {
    width: planeWidth,
    height: planeHeight
  }, scene);
  plane.position = new BABYLON.Vector3(118, 6.5, -26.7);
  plane.rotation = new BABYLON.Vector3(0, deg1 * 250, 0);
  plane.scaling = new BABYLON.Vector3(1.7, 1.3, 1.3);
  var plane2 = BABYLON.MeshBuilder.CreatePlane("plane2", {
    width: planeWidth,
    height: planeHeight
  }, scene);
  plane2.position = new BABYLON.Vector3(118, 6.5, 29.8);
  plane2.rotation = new BABYLON.Vector3(0, deg1 * 290, 0);
  plane2.scaling = new BABYLON.Vector3(1.7, 1.3, 1.3);
  //Set width and height for dynamic texture using same multiplier
  var DTWidth = planeWidth * 60;
  var DTHeight = planeHeight * 60;
  //Create dynamic texture
  var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {
    width: DTWidth,
    height: DTHeight
  }, scene);
  var dynamicTexture2 = new BABYLON.DynamicTexture("DynamicTexture2", {
    width: DTWidth,
    height: DTHeight
  }, scene);
  //Check width of text for given font type at any size of font
  var ctx = dynamicTexture.getContext();
  var size = 12; //any value will work
  //Set font 
  var font_type = "Arial";
  ctx.font = size + "px " + font_type;
  var font = "bold " + 100 + "px " + font_type;
  //Draw text
  dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);
  dynamicTexture2.drawText(text2, null, null, font, "#000000", "#ffffff", true);
  //create material
  var mat = new BABYLON.StandardMaterial("mat", scene);
  var mat2 = new BABYLON.StandardMaterial("mat2", scene);
  mat.diffuseTexture = dynamicTexture;
  mat2.diffuseTexture = dynamicTexture2;
  //apply material
  plane.material = mat;
  plane2.material = mat2;

  // description model   
  var descSrc = [
    "commerce.png",
    "stage.png",
    "camp.png",
    "dex.png",
    "balloon.png"
  ]
  var mediaSrc = [
    "vid1.mp4",
    "vid2.mp4"
  ]
  var descText = [
    "It’s now that cherished time of year where all across our great blue sphere we celebrate with joy and cheer that special bond that brings us here."
  ]
  // function attact model name   
  var attachLabel = function attachLabel(modelName, modelText, modelPositionY, modelPositionX, modelPositionZ) {
    // GUI
    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.parent = modelName;
    rect1.width = "100px";
    rect1.height = "25px";
    rect1.thickness = 0;
    rect1.background = "black";
    rect1.alpha = 0.6;
    rect1.cornerRadius = 25;
    advancedTexture.addControl(rect1);
    rect1.linkWithMesh(modelName);
    rect1.linkOffsetY = modelPositionY;
    rect1.linkOffsetX = modelPositionX;
    rect1.linkOffsetZ = modelPositionZ;

    var label = new BABYLON.GUI.TextBlock();
    label.text = modelText;
    label.color = "white";
    label.fontSize = "14px";
    rect1.addControl(label);
  }

  // rotate camera animation
  // function rotateCamera() {
  //   scene.registerBeforeRender(function () {
  //       camera.alpha += 0.0001;
  //   });
  // }
  // rotateCamera();

  // function hover mesh event
  function makeDescription(targetMesh, target, rectWidth, rectHeight, offsetY, descriptions) {

    // description for model
    let descWrap = new BABYLON.GUI.Rectangle();
    advancedTexture.addControl(descWrap);
    descWrap.width = rectWidth;
    descWrap.height = rectHeight;
    descWrap.thickness = 2;
    descWrap.background = "black";
    descWrap.scaleX = 0;
    descWrap.scaleY = 0;
    descWrap.alpha = 0.6;
    descWrap.cornerRadius = 30;
    descWrap.linkWithMesh(target);
    descWrap.linkOffsetX = 0;
    descWrap.linkOffsetY = offsetY;
    descWrap.dispose();

    let desc = new BABYLON.GUI.TextBlock();
    desc.text = descriptions;
    desc.color = "White";
    desc.fontSize = 14;
    desc.textWrapping = true;
    desc.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    desc.paddingTop = "10px";
    desc.paddingBottom = "10px";
    desc.paddingLeft = "10px";
    desc.paddingRight = "10px";
    descWrap.addControl(desc);
    desc.dispose();

    targetMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      document.body.style.cursor = 'pointer';
      descWrap.scaleX = 1;
      descWrap.scaleY = 1;
    }));
    targetMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      document.body.style.cursor = ''
      descWrap.scaleX = 0;
      descWrap.scaleY = 0;
    }));
  }

  var contentModal = document.getElementById("contentModal");
  var descImg = document.querySelector("#contentModal img");
  var closeContentModal = document.getElementById("closeContentModal");
  var gameMoney = document.querySelector("#gameMoney");
  var dimLayer = document.querySelector("#dimLayer");
  var penguinSwap = document.querySelector("#penguinSwap");
  var mediaModal = document.querySelector("#mediaModal");
  var videoCont = document.querySelector("#mediaWrap video");
  var videoClose = document.getElementById("mediaClose");

  // function click mesh event   
  var clickMeshEvent = function clickMeshEvent(target, xVal, zVal, yVal) {
    var ease = new BABYLON.CubicEase();
    var speed = 60;
    var frameCount = 180;
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    // camera move
    var animateCameraTargetToPosition = function (cam, speed, frameCount, newPos) {
      var aable1 = BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', speed, frameCount, cam.target, newPos, 0, ease);
      aable1.disposeOnEnd = true;
    }
    var animateCameraToPosition = function (cam, speed, frameCount, newPos) {
      var aable2 = BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, frameCount, cam.position, newPos, 0, ease);
      aable2.disposeOnEnd = true;
    }

    var clickStation = function clickStation(targetMesh) {
      var clickedMesh = targetMesh;
      animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(clickedMesh._absolutePosition._x, yVal, clickedMesh._absolutePosition._z));
      animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(clickedMesh._absolutePosition._x - xVal, 50, clickedMesh._absolutePosition._z + zVal));
      // camera.lowerRadiusLimit = 100;
      // camera.radius = 150;
    }

    target.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
      clickStation(ev.source, xVal, zVal, yVal);
      console.log(ev.source.name);
      camera.detachControl();
      gameMoney.style.display = "none";
      contentModal.classList.add("open");

      // attach modal contents
      switch (ev.source.name) {
        case "commercial":
          descImg.setAttribute("src", "./assets/img/" + descSrc[0])
          break;
        case "stage":
          descImg.setAttribute("src", "./assets/img/" + descSrc[1])
          break;
        case "campingZone":
          descImg.setAttribute("src", "./assets/img/" + descSrc[2])
          break;
        case "eventZone":
          descImg.setAttribute("src", "./assets/img/" + descSrc[3])
          break;
        case "tripZone":
          descImg.setAttribute("src", "./assets/img/" + descSrc[4])
          break;
      }
    }));
  }

  var clickCoinEvent = function clickCoinEvent(target) {
    target.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
      console.log(ev.source.name);
      camera.detachControl();
      dimLayer.classList.add("show");
      penguinSwap.classList.add("show");
    }));
  }

  var moveTo = function moveTo(cam, target, alpha, beta, radius, endCallBack = () => {}) {
    camera.lowerRadiusLimit = 0;
    var ease = new BABYLON.PowerEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation('targetMove', cam, 'target', 50, 80, cam.target, target, 0, ease);
    BABYLON.Animation.CreateAndStartAnimation('alphaMove', cam, 'alpha', 50, 80, cam.alpha, alpha, 0, ease);
    BABYLON.Animation.CreateAndStartAnimation('betaMove', cam, '', 50, 80, cam.beta, beta, 0, ease);
    BABYLON.Animation.CreateAndStartAnimation('cameraMove', cam, 'radius', 50, 80, cam.radius, radius, 0, ease, () => {
      camera.lowerRadiusLimit = radius;
      if (endCallBack) endCallBack();
    });
  }

  // close content modal and initialize camera
  closeContentModal.addEventListener("click", function () {
    gameMoney.style.display = "block";
    contentModal.classList.remove("open");
    mediaModal.style.display = "none"
    videoCont.setAttribute("src", "");
    moveTo(camera, new BABYLON.Vector3(0, 0, 0), 0.055, 0.648, 410, () => {
      camera.lowerRadiusLimit = 150;
      camera.upperRadiusLimit = 410;
      camera.attachControl();
    })
  })

  // close swap screen
  dimLayer.addEventListener("click", function () {
    this.classList.remove("show");
    penguinSwap.classList.remove("show");
    serviceInfoCont.classList.remove("show");
    camera.attachControl();
  })

  BABYLON.SceneLoader.ImportMesh("", "./assets/model/", "island.glb", scene, function (newMeshes) {
    console.log(newMeshes);
    var ground = newMeshes[0];
    var sea = newMeshes[1];
    var island1 = newMeshes[2];
    var island2 = newMeshes[3];
    var island3 = newMeshes[4];
    var island4 = newMeshes[5];
    var island5 = newMeshes[6];
    var ship = newMeshes[7];
    ground.isVisible = false;
    sea.isVisible = false;
    island1.id = "island1";
    island1.name = "island1";
    island2.id = "island2";
    island2.name = "island2";
    island3.id = "island3";
    island3.name = "island3";
    island4.id = "island4";
    island4.name = "island4";
    island5.id = "island5";
    island5.name = "island5";
    ship.name = "ship";
    ship.id = "ship";
    island1.scaling = new BABYLON.Vector3(5, 5, 5);
    island1.position = new BABYLON.Vector3(350, -20, 0);
    island1.rotation = new BABYLON.Vector3(deg1 * 260, 0, 0);
    island2.scaling = new BABYLON.Vector3(5, 5, 5);
    island2.position = new BABYLON.Vector3(-300, -20, -150);
    island2.rotation = new BABYLON.Vector3(deg1 * 260, 0, 0);
    island3.scaling = new BABYLON.Vector3(5, 5, 5);
    island3.position = new BABYLON.Vector3(-200, -20, 250);
    island3.rotation = new BABYLON.Vector3(deg1 * 260, 0, 0);
    island4.scaling = new BABYLON.Vector3(5, 5, 5);
    island4.position = new BABYLON.Vector3(0, -20, -300);
    island4.rotation = new BABYLON.Vector3(deg1 * 260, 0, 0);
    island5.scaling = new BABYLON.Vector3(6, 6, 6);
    island5.position = new BABYLON.Vector3(150, -20, 300);
    island5.rotation = new BABYLON.Vector3(deg1 * 260, 0, 0);

    //   load ship
    ship.scaling.scaleInPlace(0.08);
    ship.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager = new BABYLON.ActionManager(scene);
    // Animations
    var alpha = 0;
    var alpha2 = deg * 2;
    scene.registerBeforeRender(function () {
      ship.position.x += 0.5;
      ship.position.x = 240 * Math.cos(alpha);
      ship.position.y = -20;
      ship.position.z = 240 * Math.sin(alpha);
      ship.rotation = new BABYLON.Vector3(0, deg1 * 95 + alpha2, 0);
      alpha += 0.0009;
      alpha2 -= 0.00085;
    });
  })

  // load mesh
  BABYLON.SceneLoader.ImportMesh("", "./assets/model/", "metakong_map3.glb", scene, function (newMeshes) {
    console.log(newMeshes);
    var ground = newMeshes[0];
    ground.id = "ground";
    ground.name = "ground";
    ground.scaling = new BABYLON.Vector3(-11, 11, 11);
    ground.rotation = new BABYLON.Vector3(0, deg * 2, 0);
    ground.position = new BABYLON.Vector3(0, -11, 0);

    var stage = newMeshes[11];
    stage.id = "stage";
    stage.name = "stage";
    stage.actionManager = new BABYLON.ActionManager(scene);
    stage.actionManager.isRecursive = true;
    stage.isPickable = true;
    attachLabel(newMeshes[11], "오픈스테이지", -30, 30, 200);
    clickMeshEvent(stage, -100, -20, 0);
    makeDescription(stage, newMeshes[11], "330px", "60px", "-120px", descText[0]);

    var commercial = newMeshes[2];
    commercial.id = "commercial";
    commercial.name = "commercial";
    commercial.actionManager = new BABYLON.ActionManager(scene);
    commercial.actionManager.isRecursive = true;
    commercial.isPickable = true;
    attachLabel(newMeshes[2], "상점가", -120, -30, 0);
    clickMeshEvent(commercial, -50, 120, 0);
    makeDescription(commercial, newMeshes[2], "330px", "60px", "-120px", descText[0]);

    var eventZone = newMeshes[9];
    eventZone.id = "eventZone";
    eventZone.name = "eventZone";
    eventZone.actionManager = new BABYLON.ActionManager(scene);
    eventZone.actionManager.isRecursive = true;
    eventZone.isPickable = true;
    attachLabel(newMeshes[9], "이글루스왑", -30, 0, 0);
    clickMeshEvent(eventZone, -50, -80, 0);
    makeDescription(eventZone, newMeshes[9], "330px", "60px", "-120px", descText[0]);

    var campingZone = newMeshes[8];
    campingZone.id = "campingZone";
    campingZone.name = "campingZone";
    campingZone.actionManager = new BABYLON.ActionManager(scene);
    campingZone.actionManager.isRecursive = true;
    campingZone.isPickable = true;
    attachLabel(newMeshes[8], "캠핑장", -30, 0, 0);
    clickMeshEvent(campingZone, 20, -60, 0);
    makeDescription(campingZone, newMeshes[8], "330px", "60px", "-120px", descText[0]);

    var tripZone = newMeshes[7];
    tripZone.id = "tripZone";
    tripZone.name = "tripZone";
    tripZone.actionManager = new BABYLON.ActionManager(scene);
    tripZone.actionManager.isRecursive = true;
    tripZone.isPickable = true;
    attachLabel(newMeshes[7], "열기구승강장", -30, 0, 0);
    clickMeshEvent(tripZone, -160, -20, 0);
    makeDescription(tripZone, newMeshes[7], "330px", "60px", "-120px", descText[0]);

    var coin = newMeshes[5];
    coin.id = "coin";
    coin.name = "coin";
    coin.actionManager = new BABYLON.ActionManager(scene);
    coin.actionManager.isRecursive = true;
    coin.isPickable = true;
    clickCoinEvent(coin);

    var cloud = newMeshes[13];
    cloud.id = "cloud";
    cloud.name = "cloud";

    var cloud2 = cloud.clone("cloud2");

    cloud2.position = new BABYLON.Vector3(0, 7, 10);
    cloud2.scaling.scaleInPlace(0.5);
    cloud2.rotation = new BABYLON.Vector3(deg * 1, deg1 * 90, 0)

    var direction2 = true;
    scene.registerBeforeRender(function () {
      // Check if cloud2 is moving right
      if (cloud2.position.x < 5 && direction2) {
        cloud2.position.x += 0.01;
      } else {
        direction2 = false;
      }
      // Check if cloud2 is moving left
      if (cloud2.position.x > 0.5 && !direction2) {
        cloud2.position.x -= 0.01;
      } else {
        direction2 = true;
      }
    });

    // Animations
    var coin = newMeshes[5];
    var alpha1 = 0;
    scene.registerBeforeRender(function () {
      coin.rotation = new BABYLON.Vector3(deg * 1, alpha1, 0);
      alpha1 += 0.05;
    });

    var hotballoon = newMeshes[4];
    hotballoon.position = new BABYLON.Vector3(-15.1, 0, 6.25);
    var direction = true;
    scene.registerBeforeRender(function () {
      // Check if hotballoon is moving right
      if (hotballoon.position.y < 10 && direction) {
        hotballoon.position.y += 0.02;
      } else {
        direction = false;
      }
      // Check if hotballoon is moving left
      if (hotballoon.position.y > 0.5 && !direction) {
        hotballoon.position.y -= 0.02;
      } else {
        direction = true;
      }
    });

    var land = newMeshes[15];
    var sea = newMeshes[3];
    land.receiveShadows = true;
    // sea.receiveShadows = true;

    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    for (i = 0; i < newMeshes.length; i++) {
      shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
    }
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 64;
  });

  var planeOpts = {
    height: 5.4762,
    width: 7.3967,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
  };

  var vid1 = BABYLON.MeshBuilder.CreatePlane("myUniverse", planeOpts, scene);
  vid1.position = new BABYLON.Vector3(112, 1.6, 1.6);
  vid1.scaling = new BABYLON.Vector3(4.3, 3.3, 1);
  vid1.rotation = new BABYLON.Vector3(0, deg * 1, 0);
  var vid1Mat = new BABYLON.StandardMaterial("m", scene);
  var vid1VidTex = new BABYLON.VideoTexture("concert", "./assets/video/vid1.mp4", scene);
  vid1Mat.diffuseTexture = vid1VidTex;
  vid1Mat.roughness = 1;
  vid1Mat.emissiveColor = new BABYLON.Color3.White();
  vid1.material = vid1Mat;
  vid1VidTex.video.muted = true;
  vid1VidTex.video.play();
  scene.onPointerObservable.add(function (evt) {
    if (evt.pickInfo.pickedMesh === vid1) {
      mediaModal.style.display = "block";
      videoCont.setAttribute("src", "./assets/video/" + mediaSrc[0]);
    }
  }, BABYLON.PointerEventTypes.POINTERPICK);

  var vid2 = BABYLON.MeshBuilder.CreatePlane("lalaLand", planeOpts, scene);
  vid2.position = new BABYLON.Vector3(132.6, 2, 116.5);
  vid2.scaling = new BABYLON.Vector3(4.3, 3.3, 1);
  vid2.rotation = new BABYLON.Vector3(0, (deg * 2) + (deg / 6), 0);
  var vid2Mat = new BABYLON.StandardMaterial("m", scene);
  var vid2VidTex = new BABYLON.VideoTexture("movie", "./assets/video/vid2.mp4", scene);
  vid2Mat.diffuseTexture = vid2VidTex;
  vid2Mat.roughness = 1;
  vid2Mat.emissiveColor = new BABYLON.Color3.White();
  vid2.material = vid2Mat;
  vid2VidTex.video.muted = true;
  vid2VidTex.video.play();
  scene.onPointerObservable.add(function (evt) {
    if (evt.pickInfo.pickedMesh === vid2) {
      mediaModal.style.display = "block";
      videoCont.setAttribute("src", "./assets/video/" + mediaSrc[1]);
    }
  }, BABYLON.PointerEventTypes.POINTERPICK);

  videoClose.addEventListener("click", function () {
    mediaModal.style.display = "none";
    videoCont.setAttribute("src", "");
  })

  return scene;
}

window.initFunction = async function () {


  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  window.engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  window.scene = createScene();
};

// render scene
initFunction().then(() => {
  sceneToRender = scene
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});