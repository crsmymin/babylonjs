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

  engine.enableOfflineSupport = false;

  // Scene and Camera
  var scene = new BABYLON.Scene(engine);
  //Rendering loop (executed for everyframe)
  // scene.onBeforeRenderObservable.add(() => {
  //   console.log("1");
  // })

  var camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
  scene.activeCamera = camera;
  scene.activeCamera.attachControl(canvas, true);

  camera.setPosition(new BABYLON.Vector3(50, 60, 0));
  camera.lowerBetaLimit = 0.3;
  camera.upperBetaLimit = (Math.PI / 2) * 0.9;
  camera.lowerRadiusLimit = 15;
  camera.upperRadiusLimit = 100;
  camera.attachControl(canvas, true);

  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  light.specular = BABYLON.Color3.Black();

  //Using a procedural texture to create the sky
  var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 230, 230, scene);
  boxCloud.position = new BABYLON.Vector3(1, 1, 1);
  var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
  var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 1024, scene);
  cloudMaterial.emissiveTexture = cloudProcText;
  cloudMaterial.backFaceCulling = false;
  cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  boxCloud.material = cloudMaterial;

  // Ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 250, width: 250, subdivisions: 4 }, scene);
  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
  groundMaterial.diffuseTexture.uScale = 25;
  groundMaterial.diffuseTexture.vScale = 25;
  groundMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
  ground.material = groundMaterial;

  // load thema park
  BABYLON.SceneLoader.ImportMesh("", "./", "scene.gltf", scene, function (newMeshes) {
    var land = newMeshes[0];
    land.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
    land.position.y = -0.1;
    land.position.x = -30; 
    land.position.z = 0;

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    let rect1 = new BABYLON.GUI.Rectangle();
        rect1.parent = land;
        rect1.width = "150px";
        rect1.height ="35px";
        rect1.thickness = 0;  
        rect1.background = "black";
        rect1.alpha = 0.6;
        rect1.cornerRadius = 25;  
        advancedTexture.addControl(rect1);
        rect1.linkWithMesh(land);
        rect1.linkOffsetY = -180;
        
        var label = new BABYLON.GUI.TextBlock();
        label.text = "놀이공원";
        label.color = "white";
        rect1.addControl(label);
        rect1.linkOffsetY = 150;
        land.label = rect1;

    scene.onBeforeRenderObservable.add(() => {
      const d = BABYLON.Vector3.Distance(camera.position, land.position);

      rect1.width = 0.8 * 11 / d;
      rect1.height = 0.25 * 11 / d;
      label.fontSize = 100 * 11 / d; 
    });
    
    land.actionManager = new BABYLON.ActionManager(scene);
    land.actionManager.isRecursive = true;

    land.actionManager.registerAction(new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPickUpTrigger },function() {
        console.log("clicked thema park")
      }
    ));
    land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
        // write somthing ... 
        document.body.style.cursor='pointer'
        // scene.beginAnimation(rect1, 0, 10, false);
      }
    ));
    land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
        // write somthing ...
        document.body.style.cursor=''
        // scene.beginAnimation(rect1, 10, 0, false);
      }
    ));

  });

  // load airplane
  BABYLON.SceneLoader.ImportMesh("", "./", "scene_ap.gltf", scene, function (newMeshes) {
    var airPlane = newMeshes[0];
    airPlane.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    airPlane.position.y = 20;
    airPlane.position.x += 10; 
    airPlane.position.z = 0;

    scene.actionManager = new BABYLON.ActionManager(scene);
    
    // Animations
    var alpha = 0;
    scene.registerBeforeRender(function () {
      airPlane.position.x = 70 * Math.cos(alpha);
      airPlane.position.y = 25;
      airPlane.position.z = 70 * Math.sin(alpha);
      alpha += 0.005;
      
    });
  });

  

  // // load thema part gltf
  // BABYLON.SceneLoader.ImportMesh("", "./", "scene1.gltf", scene, function (newMeshes) {
  //   var land = newMeshes[0];
  //   // camera.target = land;
    
  //   land.actionManager = new BABYLON.ActionManager(scene);
  //   land.actionManager.isRecursive = true;

  //   let rect1 = new BABYLON.GUI.Rectangle();
  //     advancedTexture.addControl(rect1);
  //     rect1.width = "200px";
  //     rect1.height ="40px";
  //     rect1.thickness = 2;        
  //     rect1.linkOffsetX = "250px";
  //     rect1.linkOffsetY = "-100px";
  //     rect1.transformCenterX = 0;
  //     rect1.transformCenterY = 1;  
  //     rect1.background = "grey";
  //     rect1.alpha = 0.7;
  //     rect1.scaleX = 0;
  //     rect1.scaleY = 0;
  //     rect1.cornerRadius = 20
  //     rect1.linkWithMesh(land);     

  //   let text1 = new BABYLON.GUI.TextBlock();
  //     text1.text = "just night town";
  //     text1.color = "White";
  //     text1.fontSize = 14;
  //     text1.textWrapping = true;
  //     text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //     text1.background = '#006994'
  //     rect1.addControl(text1)
  //     text1.alpha = (1/text1.parent.alpha);
  //     text1.paddingTop = "10px";
  //     text1.paddingBottom = "10px";
  //     text1.paddingLeft = "10px";
  //     text1.paddingRight = "10px";

  //   let scaleXAnimation = new BABYLON.Animation("myAnimation", "scaleX", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  //   let scaleYAnimation = new BABYLON.Animation("myAnimation", "scaleY", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

  //   var keys = [];

  //   keys.push({
  //     frame: 0,
  //     value: 0
  //   });
  //   keys.push({
  //     frame: 10,
  //     value: 1
  //   });

  //   scaleXAnimation.setKeys(keys);
  //   scaleYAnimation.setKeys(keys);
  //   rect1.animations = [];
  //   rect1.animations.push(scaleXAnimation);
  //   rect1.animations.push(scaleYAnimation);    

  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPickUpTrigger },function() {
  //       alert('clicked night town!');
  //     }
  //   ));
  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
  //       // write somthing ...
  //       document.body.style.cursor='pointer'
  //       scene.beginAnimation(rect1, 0, 10, false);
  //     }
  //   ));
  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
  //       // write somthing ...
  //       document.body.style.cursor=''
  //       scene.beginAnimation(rect1, 10, 0, false);
  //     }
  //   ));

  //   land.actionManager.hoverCursor = "pointer";
  
  //   land.scaling.scaleInPlace(1);
  //   land.position.y = -0.2;
  //   land.position.x = 30; 
  //   land.position.z = 0; 
  //   land.isPickable = true;
  // });

  // // load town gltf
  // BABYLON.SceneLoader.ImportMesh("", "./", "scene2.gltf", scene, function (newMeshes) {
  //   var land = newMeshes[0];
  //   // camera.target = land;
    
  //   land.actionManager = new BABYLON.ActionManager(scene);
  //   land.actionManager.isRecursive = true;

  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPickUpTrigger },function() {
  //       alert('clicked town!');
  //     }
  //   ));
  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
  //       console.log("hover");
  //       // write somthing ...
  //       document.body.style.cursor='pointer'
  //       if (!land.hover) {
  //         land.hover = true;
  //         const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 1, diameterY: 0.1, diameterZ: 1});

  //         var mat = new BABYLON.StandardMaterial("mat1", scene);
  //         mat.alpha = 0;
  //         mat.diffuseColor = new BABYLON.Color4(1, 1, 1, 0.1);

  //         var hl = new BABYLON.HighlightLayer("hl1", scene);
  //         hl.addMesh(sphere, BABYLON.Color3.Green());

  //         sphere.parent = land;
  //         sphere.material = mat;
  //         land.highlight = sphere;

  //         sphere.scaling.x = 1.5;
  //         sphere.scaling.z = 1.5;

  //       }
  //     }
  //   ));
  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
  //       // write somthing ...
  //       console.log("hover out");
  //       document.body.style.cursor=''
  //     }
  //   ));

  //   land.actionManager.hoverCursor = "pointer";
  
  //   land.scaling.scaleInPlace(0.5);
  //   land.position.y = 0.5;
  //   land.position.x = 0; 
  //   land.position.z = 0; 
  //   // land.isPickable = true;
  // });

  // // load thema part gltf
  // BABYLON.SceneLoader.ImportMesh("", "./", "scene3.gltf", scene, function (newMeshes) {
  //   var land = newMeshes[0];
  //   // camera.target = land;
    
  //   land.actionManager = new BABYLON.ActionManager(scene);
  //   land.actionManager.isRecursive = true;

  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnPickUpTrigger },function() {
  //       alert('clicked thema park!');
  //     }
  //   ));
  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
  //       // write somthing ...
  //       document.body.style.cursor='pointer'
  //     }
  //   ));
  //   land.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
  //       // write somthing ...
  //       document.body.style.cursor=''
  //     }
  //   ));

  //   land.actionManager.hoverCursor = "pointer";
  
  //   land.scaling.scaleInPlace(3);
  //   land.position.y = -0.2;
  //   land.position.x = 0; 
  //   land.position.z = 30; 
  //   land.isPickable = true;
  // });


  scene.registerBeforeRender(function () {
    light.position = camera.position;
    // camera.alpha += 0.0005 * scene.getAnimationRatio();
  });

  // var planeOpts = {
  //   height: 5.4762, 
  //   width: 10.3967, 
  //   sideOrientation: BABYLON.Mesh.DOUBLESIDE
	// };
	// var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
	// var vidPos = (new BABYLON.Vector3(0,10,1))
  //   ANote0Video.position = vidPos;
	// var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
	// var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex","./textures/sample.mp4", scene);
	// ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
	// ANote0VideoMat.roughness = 1;
	// ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
	// ANote0Video.material = ANote0VideoMat;
	// scene.onPointerObservable.add(function(evt){
	// 		if(evt.pickInfo.pickedMesh === ANote0Video){
  //               //console.log("picked");
	// 				if(ANote0VideoVidTex.video.paused)
	// 					ANote0VideoVidTex.video.play();
	// 				else
	// 					ANote0VideoVidTex.video.pause();
  //                   console.log(ANote0VideoVidTex.video.paused?"paused":"playing");
	// 		}
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