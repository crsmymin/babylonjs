var loadingScreenDiv = window.document.getElementById("loadingScreen");
var btnEnter = document.getElementById("btnEnter");

if (document.readyState === "complete") {
  // Fully loaded!

} else if (document.readyState === "interactive") {
  // DOM ready! Images, frames, and other subresources are still downloading.

} else {
  // Loading still in progress.
  // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.
  window.addEventListener("DOMContentLoaded", () => {
    // DOM ready! Images, frames, and other subresources are still downloading.
  });

  window.addEventListener("load", () => {
    // Fully loaded!
    setTimeout(function () {
      requestAnimationFrame(function () {
        document.getElementById("gauge").style.width = "100%";
      });
      document.getElementById("status").style.display = "none";
      document.getElementById("btnEnter").style.display = "block";
    }, 2000)
    setTimeout(function () {
      loadingScreenDiv.classList.add("disapear");
    }, 15000)
  });
}

btnEnter.addEventListener("click", () => {
  loadingScreenDiv.classList.add("disapear");
})

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

  // scene.debugLayer.show();

  // camera
  camera.minZ = 1;
  camera.maxZ = 30000;
  camera.lowerBetaLimit = 0.9;
  camera.upperBetaLimit = 1.3;
  camera.angularSensibilityX = 5000;
  camera.lowerRadiusLimit = 120;
  camera.upperRadiusLimit = 450;
  camera.panningDistanceLimit = 1;
  camera.wheelPrecision = 1;
  camera.pinchPrecision = 0.5;
  camera.pinchZoom = true;
  camera.setPosition(new BABYLON.Vector3(0, 500, -700));
  camera.attachControl(canvas, true, false, 3);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.inputs.attached.mousewheel.wheelPrecisionY = 100;

  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  var light3 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0.5, 1, 0), scene);
  light.intensity = 1;
  light3.intensity = 1;
  light.specular = BABYLON.Color3.Black();
  light3.specular = BABYLON.Color3.Black();

  // // sphere skybox
  //  var skybox = BABYLON.MeshBuilder.CreateSphere("skyBox", {diameter:2000, sideOrientation:2}, scene);
  // 	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  // 	//skyboxMaterial.backFaceCulling = false;
  // 	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://raw.githubusercontent.com/crsmymin/babylonjs/master/textures/skybox", scene);
  // 	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  // 	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  // 	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // 	skybox.material = skyboxMaterial;		

  //   cube skybox
  // var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
  //   size: 3600
  // }, scene);
  // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  // skyboxMaterial.backFaceCulling = false;
  // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
  // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // skybox.material = skyboxMaterial;

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var deg = Math.PI / 2;
  // description model   
  var contentTitles = [
    "서울시청",
    "남산타워",
    "창덕궁",
    "삼성동 코엑스",
    "보타닉파크"
  ]
  var descText = [
    "It’s now that cherished time of year where all across our great blue sphere we celebrate with joy and cheer that special bond that brings us here."
  ]
  var linkUrl = [
    "https://www.naver.com/",
    "https://www.daum.net/",
    "https://doc.babylonjs.com/",
    "https://https://forum.babylonjs.com/"
  ]

  // function attact model name   
  var attachLabel = function attachLabel(modelName, modelText, modelPositionY) {
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

    var label = new BABYLON.GUI.TextBlock();
    label.text = modelText;
    label.color = "white";
    label.fontSize = "14px";
    rect1.addControl(label);
  }

  // rotate camera
  //   function rotateCamera() {
  //     scene.registerBeforeRender(function () {
  //         camera.alpha += 0.0001;
  //     });
  //   }
  //   rotateCamera();

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

  // image gui
  var attactLinkButton = function attactLinkButton(target, scaleX, scaleY, offsetY, targetLink) {
    var enterButton = BABYLON.GUI.Button.CreateImageButton("but", "", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/textures/enterance.png");
    enterButton.width = "65px";
    enterButton.height = "65px";
    enterButton.scaleX = 0 + scaleX;
    enterButton.scaleY = 0 + scaleY;
    enterButton.thickness = 0;
    enterButton.alpha = 0.9;
    enterButton.cornerRadius = 250;
    enterButton.image.width = "100%";
    enterButton.image.height = "100%";
    advancedTexture.addControl(enterButton);
    enterButton.linkWithMesh(target);
    enterButton.linkOffsetY = offsetY
    enterButton.hoverCursor = "pointer";

    enterButton.onPointerClickObservable.add(function () {
      window.open(targetLink, '_blank');
    });
  }

  var contentModal = document.getElementById("contentModal");
  var closeContentModal = document.getElementById("closeContentModal");
  var contentTitle = document.querySelector("#contentWrap h3");
  var contentLink = document.querySelector("#contentWrap #link");

  // function click mesh event   
  var clickMeshEvent = function clickMeshEvent(target, xVal, zVal, yVal, btnPos, btnPosY, targetLink) {
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
    }

    target.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
      clickStation(ev.source, xVal, zVal, yVal);
      console.log(ev.source.name);
      camera.detachControl();
      contentModal.classList.add("open");

      // attact modal contents
      switch(ev.source.name) {
        case "cityHall":
          contentTitle.innerHTML = contentTitles[0];
          contentLink.setAttribute("href", linkUrl[0]);
          break;
        case "nTower":
          contentTitle.innerHTML = contentTitles[1];
          contentLink.setAttribute("href", linkUrl[1]);
          break;
        case "changduck":
          contentTitle.innerHTML = contentTitles[2];
          contentLink.setAttribute("href", linkUrl[2]);
          break;
        case "coex":
          contentTitle.innerHTML = contentTitles[3];
          contentLink.setAttribute("href", linkUrl[3]);
          break;
        case "botanic":
          contentTitle.innerHTML = contentTitles[4];
          contentLink.setAttribute("href", linkUrl[3]);
          break;
      }
    }));
  }

  // close content modal and initialize camera
  closeContentModal.addEventListener("click", function() {
    contentModal.classList.remove("open");
    moveTo(camera, new BABYLON.Vector3(0, 0, 0), 4.7124, 0.95, 600, () => {
      camera.lowerRadiusLimit = 120;
      camera.upperRadiusLimit = 450;
      camera.attachControl();
    })
  })

  // var setPointerObservable = function setPointerObservable() {
  //   scene.onPointerObservable.add((pointerInfo) => {
  //     switch (pointerInfo.type) {
  //       case BABYLON.PointerEventTypes.POINTERWHEEL:
  //         if (pointerInfo.event.wheelDelta < 0) {
  //           if (pointerInfo.event.deltaY > 0) {
  //             // zoom out
  //             console.log("zoom out");
  //             scene.upperRadiusLimit = 0;
  //             moveTo(camera, new BABYLON.Vector3(0, 0, 0), 4.7124, 0.95, 600, () => {
  //               camera.lowerRadiusLimit = 120;
  //               camera.upperRadiusLimit = 480;
  //               camera.attachControl();
  //               pointerStatus = "";
  //             })
  //           }
  //         } else {
  //           // zoom in
  //           console.log("zoom in");
  //         }
  //         break;
  //     }
  //   });
  // 

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

  // load mesh
  BABYLON.SceneLoader.ImportMesh("", "./assets/model/", "SeoulMap_night.glb", scene, function (newMeshes) {
    console.log(newMeshes);
    var ground = newMeshes[0];
    ground.id = "ground";
    ground.name = "ground";
    ground.scaling = new BABYLON.Vector3(-25, 25, 25);
    ground.rotation = new BABYLON.Vector3(0, deg * 2, 0);
    ground.position = new BABYLON.Vector3(0, -11, 0);

    var cityHall = newMeshes[1];
    cityHall.id = "cityHall";
    cityHall.name = "cityHall";
    cityHall.actionManager = new BABYLON.ActionManager(scene);
    cityHall.actionManager.isRecursive = true;
    cityHall.isPickable = true;
    attachLabel(newMeshes[1], "시청", -30);
    clickMeshEvent(cityHall, 0, -100, 0, newMeshes[1], "-10px", linkUrl[0], () => {
      console.log(cityHall);
    });
    makeDescription(cityHall, newMeshes[1], "330px", "60px", "-120px", descText[0]);

    var nTower = newMeshes[4];
    nTower.id = "nTower";
    nTower.name = "nTower";
    nTower.actionManager = new BABYLON.ActionManager(scene);
    nTower.actionManager.isRecursive = true;
    nTower.isPickable = true;
    attachLabel(newMeshes[4], "남산타워", -70);
    clickMeshEvent(nTower, 0, -100, 0, newMeshes[4], "-10px", linkUrl[0], () => {
      console.log(nTower);
    });
    makeDescription(nTower, newMeshes[4], "330px", "60px", "-120px", descText[0]);

    var changduck = newMeshes[5];
    changduck.id = "changduck";
    changduck.name = "changduck";
    changduck.actionManager = new BABYLON.ActionManager(scene);
    changduck.actionManager.isRecursive = true;
    changduck.isPickable = true;
    attachLabel(newMeshes[5], "창덕궁", -30);
    clickMeshEvent(changduck, 0, -100, 0, newMeshes[5], "-10px", linkUrl[0], () => {
      console.log(changduck);
    });
    makeDescription(changduck, newMeshes[5], "330px", "60px", "-120px", descText[0]);

    var coex = newMeshes[13];
    coex.id = "coex";
    coex.name = "coex";
    coex.actionManager = new BABYLON.ActionManager(scene);
    coex.actionManager.isRecursive = true;
    coex.isPickable = true;
    attachLabel(newMeshes[13], "코엑스", -30);
    clickMeshEvent(coex, 0, -100, 0, newMeshes[13], "-10px", linkUrl[0], () => {
      console.log(coex);
    });
    makeDescription(coex, newMeshes[13], "330px", "60px", "-120px", descText[0]);

    var botanic = newMeshes[10];
    botanic.id = "botanic";
    botanic.name = "botanic";
    botanic.actionManager = new BABYLON.ActionManager(scene);
    botanic.actionManager.isRecursive = true;
    botanic.isPickable = true;
    attachLabel(newMeshes[10], "보타닉파크", -30);
    clickMeshEvent(botanic, 0, -100, 0, newMeshes[10], "-10px", linkUrl[0], () => {
      console.log(botanic);
    });
    makeDescription(botanic, newMeshes[10], "330px", "60px", "-120px", descText[0]);

    console.log(newMeshes[7]);
    newMeshes[7].isVisible = false;
    newMeshes[8].isVisible = false;
    newMeshes[9].isVisible = false;
    newMeshes[24].isVisible = false;
    newMeshes[28].isVisible = false;
  });

  // // load stadium
  // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-stadium.gltf", scene, function (newMeshes) {
  //   var stadium = newMeshes[0];
  //   stadium.id = "stadium";
  //   stadium.name = "stadium";
  //   stadium.scaling.scaleInPlace(1500);
  //   stadium.position = new BABYLON.Vector3(120, 1, -130);
  //   stadium.rotation = new BABYLON.Vector3(0, 0, 0);
  //   stadium.actionManager = new BABYLON.ActionManager(scene);
  //   stadium.actionManager.isRecursive = true;
  //   stadium.isPickable = true;

  //   attachLabel(newMeshes[1], "Live Streaming", -70);
  //   clickMeshEvent(stadium, 0, -100, 0, newMeshes[1], "-10px", linkUrl[0]);
  //   makeDescription(stadium, newMeshes[1], "330px", "60px", "-120px", descText[0]);
  // });

  // // load tower
  // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-tower.gltf", scene, function (newMeshes) {
  //   var tower = newMeshes[0];
  //   tower.id = "tower";
  //   tower.name = "tower";
  //   tower.scaling.scaleInPlace(1500)
  //   tower.position = new BABYLON.Vector3(55, 14, 50);
  //   tower.rotation = new BABYLON.Vector3(0, 0, 0);
  //   tower.actionManager = new BABYLON.ActionManager(scene);
  //   tower.actionManager.isRecursive = true;
  //   tower.material = new MToonMaterial('mat1', scene);

  //   attachLabel(newMeshes[1], "V-Commerce", 30);
  //   clickMeshEvent(tower, 0, -100, 60, newMeshes[1], "-55px", linkUrl[1]);
  //   makeDescription(tower, newMeshes[1], "330px", "60px", "-120px", descText[1]);
  // });

  // // load palace
  // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-gung.gltf", scene, function (newMeshes) {
  //   BABYLON.Mesh.FRONTSIDE;
  //   var palace = newMeshes[0];
  //   palace.id = "palace";
  //   palace.name = "palace";
  //   palace.scaling.scaleInPlace(1200);
  //   palace.position = new BABYLON.Vector3(0, -10, 0);
  //   palace.rotation = new BABYLON.Vector3(0, 0, 0);
  //   palace.actionManager = new BABYLON.ActionManager(scene);
  //   palace.actionManager.isRecursive = true;

  //   attachLabel(newMeshes[1], "Promotion Room", -60);
  //   clickMeshEvent(palace, 0, -100, 0, newMeshes[1], "50px", linkUrl[2]);
  //   makeDescription(palace, newMeshes[1], "330px", "60px", "-120px", descText[2]);
  // });

  // // load billboard
  // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "hansol-pan.gltf", scene, function (newMeshes) {
  //   var billboard = newMeshes[0];
  //   billboard.id = "billboard";
  //   billboard.name = "billboard";
  //   billboard.scaling.scaleInPlace(1200);
  //   billboard.position = new BABYLON.Vector3(120, 0, 145);
  //   billboard.rotation = new BABYLON.Vector3(0, 0, 0);

  //   attachLabel(newMeshes[1], "Billboard", -120);
  //   billboard.actionManager = new BABYLON.ActionManager(scene);
  //   billboard.actionManager.isRecursive = true;

  //   makeDescription(billboard, newMeshes[1], "330px", "60px", "-120px", descText[3]);
  // });



  // // load ufo
  //   BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "ufo.gltf", scene, function (newMeshes) {
  //     var ufo = newMeshes[0];
  //     ufo.id = "ufo";
  //     ufo.name = "ufo";
  //     ufo.scaling.scaleInPlace(0.015);

  //     scene.actionManager = new BABYLON.ActionManager(scene);

  //     // Animations
  //     var alpha = 0;
  //     var alpha2 = 0;
  //     scene.registerBeforeRender(function () {
  //       ufo.position.x = 250 * Math.cos(alpha);
  //       ufo.position.y = 65;
  //       ufo.position.z = 250 * Math.sin(alpha);
  //       ufo.rotation = new BABYLON.Vector3(0,alpha2,0);

  //       alpha += 0.005;
  //       alpha2 += 0.03;

  //     });
  //   });

  // load bird
  //   BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "bird2.gltf", scene, function (newMeshes) {
  //     var bird = newMeshes[0];
  //     bird.id = "bird";
  //     bird.name = "bird";
  //     bird.scaling.scaleInPlace(1);
  //     bird.actionManager = new BABYLON.ActionManager(scene); 
  //     scene.actionManager = new BABYLON.ActionManager(scene);

  //     // Animations
  //     var alpha = 0;
  //     var alpha2 = deg*2;


  //     scene.registerBeforeRender(function () {    
  //         bird.position.x += 0.5;

  //         bird.position.x = 300 * Math.cos(alpha);
  //         bird.position.y = 45;
  //         bird.position.z = 300 * Math.sin(alpha);
  //         bird.rotation = new BABYLON.Vector3(0,alpha2,0);

  //         alpha += 0.002;
  //         alpha2 -= 0.002;
  //     });

  //     bird.actionManager.isRecursive = true;
  //     makeDescription(bird,newMeshes[1],"200px","40px","-50px",descText[4]);
  //   });

  // var planeOpts = {
  //   height: 5.4762,
  //   width: 7.3967,
  //   sideOrientation: BABYLON.Mesh.DOUBLESIDE
  // };
  // var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
  // var vidPos = (new BABYLON.Vector3(120, 20, 142))
  // ANote0Video.position = vidPos;
  // ANote0Video.scaling = new BABYLON.Vector3(9, 6.8, 1);
  // ANote0Video.rotation = new BABYLON.Vector3(0, 0, 0);
  // var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
  // var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex", "textures/babylonjs.mp4", scene);
  // ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
  // ANote0VideoMat.roughness = 1;
  // ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
  // ANote0Video.material = ANote0VideoMat;
  // ANote0VideoVidTex.video.muted = true;
  // ANote0VideoVidTex.video.play();
  // scene.onPointerObservable.add(function (evt) {
  //   if (evt.pickInfo.pickedMesh === ANote0Video) {
  //     //console.log("picked");            
  //     if (ANote0VideoVidTex.video.paused) {
  //       ANote0VideoVidTex.video.play();
  //       alert("play video");
  //     } else {
  //       alert("paused video");
  //       ANote0VideoVidTex.video.pause();
  //       console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
  //     }
  //   }
  // }, BABYLON.PointerEventTypes.POINTERPICK);
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