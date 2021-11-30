var canvas = document.getElementById("renderCanvas");

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

  camera.minZ = 1;
  camera.maxZ = 30000;
  camera.lowerBetaLimit = 0.9;
  camera.upperBetaLimit = 1.3;
  camera.angularSensibilityX = 5000;
  camera.lowerRadiusLimit = 50;
  camera.upperRadiusLimit = 500;
  camera.panningDistanceLimit = 1;
  camera.wheelPrecision = 1;
  camera.pinchPrecision = 0.5;
  camera.pinchZoom = true;
  camera.setPosition(new BABYLON.Vector3(0, 450, -700));
  camera.attachControl(canvas, true, false, 3);


  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  var light3 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0.5, 0), scene);
  light.intensity = 1;
  light3.intensity = 1;
  light.specular = BABYLON.Color3.Black();
  light3.specular = BABYLON.Color3.Black();


  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
    size: 1200.0
  }, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  var deg = Math.PI / 2;

  // attact model name   
  var attachLabel = function attachLabel(modelName, modelText, modelPositionY) {
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.parent = modelName;
    rect1.width = "180px";
    rect1.height = "35px";
    rect1.thickness = 2;
    rect1.background = "black";
    rect1.alpha = 0.6;
    rect1.cornerRadius = 25;
    advancedTexture.addControl(rect1);
    rect1.linkWithMesh(modelName);
    rect1.linkOffsetY = modelPositionY;

    var label = new BABYLON.GUI.TextBlock();
    label.text = modelText;
    label.color = "white";
    label.fontSize = "16px";
    rect1.addControl(label);
  }

  // hover mesh event
  var descTextOnMesh = function descTextOnMesh(rectWidth, rectHeight, targetMesh) {
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.useInvalidateRectOptimization = false;

    let rect1 = new BABYLON.GUI.Rectangle();
    advancedTexture.addControl(rect1);
    rect1.width = rectWidth;
    rect1.height = rectHeight;
    rect1.thickness = 2;
    rect1.linkOffsetX = "150px";
    rect1.linkOffsetY = "-100px";
    rect1.transformCenterX = 0;
    rect1.transformCenterY = 1;
    rect1.background = "grey";
    rect1.alpha = 0.7;
    rect1.scaleX = 0;
    rect1.scaleY = 0;
    rect1.cornerRadius = 30
    rect1.linkWithMesh(targetMesh);

    let text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Alvar Aalto je covjek koji je donio mnogo yivota u umeetnost i ondiod a odwad woda wdmmw dmaod wa daw dmwad owaodoawodo mwmdm amw mwamm mamdm mda owuoaduoawud mamdmawmdm akdogjo dwadawdaw";
    text1.color = "White";
    text1.fontSize = 14;
    text1.textWrapping = true;
    text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    text1.background = '#006994'
    rect1.addControl(text1)
    text1.alpha = (1 / text1.parent.alpha);
    text1.paddingTop = "20px";
    text1.paddingBottom = "20px";
    text1.paddingLeft = "20px";
    text1.paddingRight = "20px";
  }



  //  click mesh event    
  var animateCameraTargetToPosition = function (cam, speed, frameCount, newPos) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    var aable1 = BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', speed, frameCount, cam.target, newPos, 0, ease);
    aable1.disposeOnEnd = true;
  }
  var animateCameraToPosition = function (cam, speed, frameCount, newPos) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    var aable2 = BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, frameCount, cam.position, newPos, 0, ease);
    aable2.disposeOnEnd = true;
  }
  var speed = 60;
  var frameCount = 180;

  var clickStation = function clickStation(targetMesh, xVal, zVal) {
    var clickedMesh = targetMesh;
    animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(clickedMesh._absolutePosition._x, 0, clickedMesh._absolutePosition._z));
    animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(clickedMesh._absolutePosition._x - xVal, 50, clickedMesh._absolutePosition._z + zVal));
  }

  // load ground
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-map.gltf", scene, function (newMeshes) {
    var ground = newMeshes[0];
    ground.id = "ground";
    ground.name = "ground";
    ground.scaling = new BABYLON.Vector3(-1400, 1400, 1400);
    ground.rotation = new BABYLON.Vector3(0, deg * 2, 0);
    ground.position = new BABYLON.Vector3(0, -11, 0);
  });

  // load stadium
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-stadium.gltf", scene, function (newMeshes) {
    var stadium = newMeshes[0];
    stadium.id = "stadium";
    stadium.name = "stadium";
    stadium.scaling.scaleInPlace(1500);
    stadium.position = new BABYLON.Vector3(120, 1, -130);
    stadium.rotation = new BABYLON.Vector3(0, 0, 0);
    attachLabel(newMeshes[1], "Live Streaming", -70);
    stadium.actionManager = new BABYLON.ActionManager(scene);
    stadium.actionManager.isRecursive = true;
    stadium.isPickable = true;


    stadium.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
      clickStation(ev.source, 0, -100);
    }));
    stadium.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer';
      descTextOnMesh(100, 50, ev.source);

    }));
    stadium.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      
    }));

  });


  // load tower
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-tower.gltf", scene, function (newMeshes) {
    var tower = newMeshes[0];
    tower.id = "tower";
    tower.name = "tower";
    tower.scaling.scaleInPlace(1500)
    tower.position = new BABYLON.Vector3(55, 14, 50);
    tower.rotation = new BABYLON.Vector3(0, 0, 0);

    // attachButton(tower, "tower shop", 10, -3);

    attachLabel(newMeshes[1], "V-Commerce", -60);
    tower.actionManager = new BABYLON.ActionManager(scene);
    tower.actionManager.isRecursive = true;

    tower.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
      clickStation(ev.source, 0, -100);
    }));
    tower.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    tower.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load palace
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-gung.gltf", scene, function (newMeshes) {
    var palace = newMeshes[0];
    palace.id = "palace";
    palace.name = "palace";
    palace.scaling.scaleInPlace(1200);
    palace.position = new BABYLON.Vector3(0, -10, 0);
    palace.rotation = new BABYLON.Vector3(0, 0, 0);


    attachLabel(newMeshes[1], "Promotion Room", -60);

    palace.actionManager = new BABYLON.ActionManager(scene);
    palace.actionManager.isRecursive = true;

    palace.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
      clickStation(ev.source, 0, -100);
    }));
    palace.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    palace.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load billboard
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-pan.gltf", scene, function (newMeshes) {
    var billboard = newMeshes[0];
    billboard.id = "billboard";
    billboard.name = "billboard";
    billboard.scaling.scaleInPlace(1200);
    billboard.position = new BABYLON.Vector3(120, 0, 145);
    billboard.rotation = new BABYLON.Vector3(0, 0, 0);
  });


  // load ufo
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "ufo.gltf", scene, function (newMeshes) {
    var ufo = newMeshes[0];
    ufo.id = "ufo";
    ufo.name = "ufo";
    ufo.scaling.scaleInPlace(0.015);

    scene.actionManager = new BABYLON.ActionManager(scene);

    // Animations
    var alpha = 0;
    var alpha2 = 0;
    scene.registerBeforeRender(function () {
      ufo.position.x = 250 * Math.cos(alpha);
      ufo.position.y = 65;
      ufo.position.z = 250 * Math.sin(alpha);
      ufo.rotation = new BABYLON.Vector3(0, alpha2, 0);

      alpha += 0.005;
      alpha2 += 0.03;

    });
  });

  // load bird
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "bird.gltf", scene, function (newMeshes) {
    var bird = newMeshes[0];
    bird.id = "bird";
    bird.name = "bird";
    bird.scaling.scaleInPlace(1.8);
    bird.position = new BABYLON.Vector3(215, 90, 20);
    bird.rotation = new BABYLON.Vector3(0, deg * 3.1, 0);


    var bird2 = bird.clone("bird2");
    bird2.id = "bird2";
    bird2.name = "bird2";
    bird2.position = new BABYLON.Vector3(-215, 90, -20);
    bird2.rotation = new BABYLON.Vector3(0, deg * 1.1, 0);

    scene.actionManager = new BABYLON.ActionManager(scene);

    // Animations
    scene.registerBeforeRender(function () {
      bird.position.x += 0.5;
      bird2.position.x -= 0.5;

      if (bird.position.x > 250) {
        bird.position.x = -250;
      }

      if (bird2.position.x < -250) {
        bird2.position.x = 250;
      }

    });
  });


  var planeOpts = {
    height: 5.4762,
    width: 7.3967,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
  };
  var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
  var vidPos = (new BABYLON.Vector3(120, 20, 142))
  ANote0Video.position = vidPos;
  ANote0Video.scaling = new BABYLON.Vector3(9, 6.8, 1);
  ANote0Video.rotation = new BABYLON.Vector3(0, 0, 0);
  var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
  var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex", "textures/babylonjs.mp4", scene);
  ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
  ANote0VideoMat.roughness = 1;
  ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
  ANote0Video.material = ANote0VideoMat;
  scene.onPointerObservable.add(function (evt) {
    if (evt.pickInfo.pickedMesh === ANote0Video) {
      //console.log("picked");            
      if (ANote0VideoVidTex.video.paused) {
        ANote0VideoVidTex.video.play();
        alert("play video");
      } else {
        alert("paused video");
        ANote0VideoVidTex.video.pause();
        console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
      }
    }
  }, BABYLON.PointerEventTypes.POINTERPICK);

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