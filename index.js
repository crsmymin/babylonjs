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

  var camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
  scene.activeCamera = camera;
  scene.activeCamera.attachControl(canvas, true);

  camera.setPosition(new BABYLON.Vector3(300, 200, -300));
  camera.lowerBetaLimit = 0.3;
  camera.upperBetaLimit = (Math.PI / 2) * 1;
  //   camera.lowerRadiusLimit = 15;
  //   camera.upperRadiusLimit = 100;
  camera.attachControl(canvas, true);
  //   camera.detachControl(canvas, true);


  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(1, 0, 0), scene);
  light.intensity = 1;
  light2.intensity = 1;
  light.specular = BABYLON.Color3.Black();
  light2.specular = BABYLON.Color3.Black();


  //Using a procedural texture to create the sky
  //   var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 100, 1000, scene);
  //   boxCloud.position = new BABYLON.Vector3(0, 0, 12);
  //   boxCloud.rotation = new BABYLON.Vector3(1, 0, 0);
  //   var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
  //   var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 1024, scene);
  //   cloudMaterial.emissiveTexture = cloudProcText;
  //   cloudMaterial.backFaceCulling = false;
  //   cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  //   boxCloud.material = cloudMaterial;

  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
    size: 1500.0
  }, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  // Ground
  //   var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 250, width: 250, subdivisions: 1 }, scene);
  //   var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  //   groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
  //   groundMaterial.diffuseTexture.uScale = 75;
  //   groundMaterial.diffuseTexture.vScale = 75;
  //   groundMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
  //   ground.material = groundMaterial;


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

  // load ground
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "ground.gltf", scene, function (newMeshes) {
    var ground = newMeshes[0];
    ground.scaling = new BABYLON.Vector3(16, 10, 16)
    ground.position = new BABYLON.Vector3(0, -13, 0);

  });

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
  var clickStation = function (meshEvent) {
    var clickedMesh = meshEvent.meshUnderPointer;
    var setCamZoom = function () {
      animateCameraTargetToPosition(camera, speed, frameCount, new BABYLON.Vector3(clickedMesh._absolutePosition._x, 0, clickedMesh._absolutePosition._z));
      animateCameraToPosition(camera, speed, frameCount, new BABYLON.Vector3(clickedMesh._absolutePosition._x - 60, 45, clickedMesh._absolutePosition._z + 30));
    }
    setCamZoom();

  }

  // load airport
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "airport.gltf", scene, function (newMeshes) {
    var airport = newMeshes[0];
    airport.scaling.scaleInPlace(1.5);
    airport.position = new BABYLON.Vector3(-95, 1, -100);
    airport.rotation = new BABYLON.Vector3(0, deg * 4, 0);


    attachLabel(newMeshes[1], "Link Abroad", -70);
    // attachButton(airport, "airport", 100, -30);

    airport.actionManager = new BABYLON.ActionManager(scene);
    airport.actionManager.isRecursive = true;
    airport.isPickable = true;

    airport.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    airport.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    airport.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load commerce
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "commerce.gltf", scene, function (newMeshes) {
    var commerce = newMeshes[0];
    commerce.scaling.scaleInPlace(0.01)
    commerce.position = new BABYLON.Vector3(110, 33, 0);
    commerce.rotation = new BABYLON.Vector3(0, deg * 1, 0);

    attachLabel(newMeshes[1], "E-Commerce", -70);

    commerce.actionManager = new BABYLON.ActionManager(scene);
    commerce.actionManager.isRecursive = true;

    commerce.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    commerce.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    commerce.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load convinience
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "convinience.gltf", scene, function (newMeshes) {
    var convinience = newMeshes[0];
    convinience.scaling.scaleInPlace(15)
    convinience.position = new BABYLON.Vector3(60, 1, -90);
    convinience.rotation = new BABYLON.Vector3(0, deg * 2, 0);

    // attachButton(convinience, "convinience shop", 10, -3);

    attachLabel(newMeshes[1], "Service Support", -60);
    convinience.actionManager = new BABYLON.ActionManager(scene);
    convinience.actionManager.isRecursive = true;

    convinience.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    convinience.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    convinience.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load office
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "office.gltf", scene, function (newMeshes) {
    var office = newMeshes[0];
    office.scaling.scaleInPlace(10)
    office.position = new BABYLON.Vector3(5, 1, -90);
    office.rotation = new BABYLON.Vector3(0, deg * 3, 0);


    attachLabel(newMeshes[1], "Promotion Room", -150);

    office.actionManager = new BABYLON.ActionManager(scene);
    office.actionManager.isRecursive = true;

    office.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    office.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    office.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load house
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "house.gltf", scene, function (newMeshes) {
    var house = newMeshes[0];
    house.scaling.scaleInPlace(7)
    house.position = new BABYLON.Vector3(-100, 1, 95);
    house.rotation = new BABYLON.Vector3(0, deg * 3, 0);


    // attachLabel(house,"House")

    house.actionManager = new BABYLON.ActionManager(scene);
    house.actionManager.isRecursive = true;

    house.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    house.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    house.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });


  // load nature park
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "nature.gltf", scene, function (newMeshes) {
    var naturePark = newMeshes[0];
    naturePark.scaling.scaleInPlace(11)
    naturePark.position = new BABYLON.Vector3(8, 1, 15);

    attachLabel(newMeshes[1], "Community Center", -70);

    naturePark.actionManager = new BABYLON.ActionManager(scene);
    naturePark.actionManager.isRecursive = true;

    naturePark.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    naturePark.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    naturePark.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load barco building
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "barco.gltf", scene, function (newMeshes) {
    var barco = newMeshes[0];
    barco.scaling.scaleInPlace(6)
    barco.position = new BABYLON.Vector3(-90, 1, 40);
    barco.rotation = new BABYLON.Vector3(0, deg * 3, 0)

    attachLabel(newMeshes[1], "Conference Hall", -70);

    barco.actionManager = new BABYLON.ActionManager(scene);
    barco.actionManager.isRecursive = true;

    barco.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    barco.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    barco.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load cafe
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "cafe.gltf", scene, function (newMeshes) {
    var cafe = newMeshes[0];
    cafe.scaling.scaleInPlace(17)
    cafe.position = new BABYLON.Vector3(60, 1, 105);
    cafe.rotation = new BABYLON.Vector3(0, deg * 1, 0)

    attachLabel(newMeshes[1], "Networkging Rounge", -70);

    cafe.actionManager = new BABYLON.ActionManager(scene);
    cafe.actionManager.isRecursive = true;

    cafe.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    cafe.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    cafe.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load building
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "building.gltf", scene, function (newMeshes) {
    var building = newMeshes[0];
    building.scaling.scaleInPlace(2)
    building.position = new BABYLON.Vector3(-25, 1, 110);
    building.rotation = new BABYLON.Vector3(0, deg * 1, 0)

    attachLabel(newMeshes[1], "V-Office2", -70);

    building.actionManager = new BABYLON.ActionManager(scene);
    building.actionManager.isRecursive = true;

    building.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickStation), function () {

    });
    building.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
      // write somthing ... 
      document.body.style.cursor = 'pointer'
      // scene.beginAnimation(rect1, 0, 10, false);
    }));
    building.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
      // write somthing ...
      document.body.style.cursor = ''
      // scene.beginAnimation(rect1, 10, 0, false);
    }));

  });

  // load airplane
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "airplane.gltf", scene, function (newMeshes) {
    var airPlane = newMeshes[0];
    airPlane.scaling.scaleInPlace(0.25);
    airPlane.position = new BABYLON.Vector3(-80, 1, -130);
    airPlane.rotation = new BABYLON.Vector3(0, deg * 1, 0)

  });

  // load tree
  var tree = BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "tree.gltf", scene, function (newMeshes) {
    var tree = newMeshes[0];
    tree.scaling.scaleInPlace(20);
    var tree2 = tree.clone("tree2");
    var tree3 = tree.clone("tree3");
    var tree4 = tree.clone("tree4");
    var tree5 = tree.clone("tree5");
    var tree6 = tree.clone("tree6");
    var tree7 = tree.clone("tree7");
    var tree8 = tree.clone("tree8");
    var tree9 = tree.clone("tree9");
    var tree10 = tree.clone("tree10");
    var tree11 = tree.clone("tree11");
    tree.position = new BABYLON.Vector3(30, 0, 90);
    tree2.position = new BABYLON.Vector3(10, 0, 90);
    tree3.position = new BABYLON.Vector3(20, 0, 110);
    tree4.position = new BABYLON.Vector3(20, 0, 140);
    tree5.position = new BABYLON.Vector3(-10, 0, 140);
    tree6.position = new BABYLON.Vector3(-40, 0, 150);
    tree7.position = new BABYLON.Vector3(-70, 0, 100);
    tree8.position = new BABYLON.Vector3(-70, 0, 130);
    tree9.position = new BABYLON.Vector3(-130, 0, 10);
    tree10.position = new BABYLON.Vector3(-110, 0, -30);
    tree11.position = new BABYLON.Vector3(-118, 0, -7);
  });



  // load ufo
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "ufo.gltf", scene, function (newMeshes) {
    var ufo = newMeshes[0];
    ufo.scaling.scaleInPlace(0.01);

    scene.actionManager = new BABYLON.ActionManager(scene);

    // Animations
    var alpha = 0;
    var alpha2 = 0;
    scene.registerBeforeRender(function () {
      ufo.position.x = 50 * Math.cos(alpha);
      ufo.position.y = 45;
      ufo.position.z = 50 * Math.sin(alpha);
      ufo.rotation = new BABYLON.Vector3(0, alpha2, 0);

      alpha += 0.01;
      alpha2 += 0.02;

    });
  });

  // load bird
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "bird.gltf", scene, function (newMeshes) {
    var bird = newMeshes[0];
    bird.scaling.scaleInPlace(1.2);
    bird.position = new BABYLON.Vector3(215, 90, 20);
    bird.rotation = new BABYLON.Vector3(0, deg * 3.1, 0);


    var bird2 = bird.clone("bird2");
    bird2.scaling.scaleInPlace(1.2);
    bird2.position = new BABYLON.Vector3(-215, 90, -20);
    bird2.rotation = new BABYLON.Vector3(0, deg * 1.1, 0);

    scene.actionManager = new BABYLON.ActionManager(scene);

    // Animations
    scene.registerBeforeRender(function () {
      //   bird.position = new BABYLON.Vector3(-32,Math.cos(alpha),97);
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


  // load car
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "car.gltf", scene, function (newMeshes) {
    var car = newMeshes[0];
    car.scaling.scaleInPlace(3);
    car.position = new BABYLON.Vector3(20, 1, -60);

    scene.actionManager = new BABYLON.ActionManager(scene);

  });

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