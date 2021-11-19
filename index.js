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

  camera.setPosition(new BABYLON.Vector3(0, 300, 150));
  camera.lowerBetaLimit = 0.3;
  camera.upperBetaLimit = (Math.PI / 2) * 1;
  //   camera.lowerRadiusLimit = 15;
  //   camera.upperRadiusLimit = 100;
  camera.attachControl(canvas, true);

  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;
  light.specular = BABYLON.Color3.Black();

  //Using a procedural texture to create the sky
  var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 100, 1000, scene);
  boxCloud.position = new BABYLON.Vector3(1, 1, 1);
  var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
  var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 512, scene);
  cloudMaterial.emissiveTexture = cloudProcText;
  cloudMaterial.backFaceCulling = false;
  cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  boxCloud.material = cloudMaterial;

  // Ground
  //   var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 250, width: 250, subdivisions: 1 }, scene);
  //   var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  //   groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
  //   groundMaterial.diffuseTexture.uScale = 75;
  //   groundMaterial.diffuseTexture.vScale = 75;
  //   groundMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
  //   ground.material = groundMaterial;


  // attact model name   
  function attachLabel(modelName, modelText) {
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    let rect1 = new BABYLON.GUI.Rectangle();
    rect1.parent = airport;
    rect1.width = "150px";
    rect1.height = "35px";
    rect1.thickness = 2;
    rect1.background = "black";
    rect1.alpha = 0.6;
    rect1.cornerRadius = 25;
    advancedTexture.addControl(rect1);
    rect1.linkWithMesh(modelName);
    rect1.linkOffsetY = -180;

    var label = new BABYLON.GUI.TextBlock();
    label.text = modelText;
    label.color = "white";
    rect1.addControl(label);
    rect1.linkOffsetY = -80;
    rect1.linkOffsetX = -50;
    airport.label = rect1;
  }

  var deg = Math.PI / 2;

  // load ground
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "ground.gltf", scene, function (newMeshes) {
    var ground = newMeshes[0];
    ground.scaling = new BABYLON.Vector3(12, 10, 12)
    ground.position = new BABYLON.Vector3(0, -13, 0);

  });

  // load airport
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "airport.gltf", scene, function (newMeshes) {
    var airport = newMeshes[0];
    airport.scaling.scaleInPlace(1)
    airport.position = new BABYLON.Vector3(-80, 1, -90);


    attachLabel(airport, "Airport")

    airport.actionManager = new BABYLON.ActionManager(scene);
    airport.actionManager.isRecursive = true;

    airport.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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


    attachLabel(commerce, "Commerce")

    commerce.actionManager = new BABYLON.ActionManager(scene);
    commerce.actionManager.isRecursive = true;

    commerce.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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


    attachLabel(convinience, "Convinience")

    convinience.actionManager = new BABYLON.ActionManager(scene);
    convinience.actionManager.isRecursive = true;

    convinience.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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


    attachLabel(office, "Office")

    office.actionManager = new BABYLON.ActionManager(scene);
    office.actionManager.isRecursive = true;

    office.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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


    attachLabel(house, "House")

    house.actionManager = new BABYLON.ActionManager(scene);
    house.actionManager.isRecursive = true;

    house.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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

    attachLabel(naturePark, "Nature park")

    naturePark.actionManager = new BABYLON.ActionManager(scene);
    naturePark.actionManager.isRecursive = true;

    naturePark.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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

    attachLabel(barco, "Barco building")

    barco.actionManager = new BABYLON.ActionManager(scene);
    barco.actionManager.isRecursive = true;

    barco.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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

    attachLabel(cafe, "Cafe")

    cafe.actionManager = new BABYLON.ActionManager(scene);
    cafe.actionManager.isRecursive = true;

    cafe.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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

  // load cafe
  BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/crsmymin/babylonjs/master/", "building.gltf", scene, function (newMeshes) {
    var building = newMeshes[0];
    building.scaling.scaleInPlace(2)
    building.position = new BABYLON.Vector3(-25, 1, 110);
    building.rotation = new BABYLON.Vector3(0, deg * 1, 0)

    attachLabel(building, "Building")

    building.actionManager = new BABYLON.ActionManager(scene);
    building.actionManager.isRecursive = true;

    building.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickUpTrigger
    }, function () {
      console.log("clicked thema park");
      // window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%8B%A4%EB%82%A0', '_blank');
    }));
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
    airPlane.position = new BABYLON.Vector3(-80, 10, -70);
    airPlane.rotation = new BABYLON.Vector3(deg * 0.25, deg * 3, 0)

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