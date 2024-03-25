import {
  Engine, FollowCamera, HemisphericLight, Scene,
  Vector3
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Universe } from './universe';

const universe=new Universe();

class App {
  constructor() {


    
    // create the canvas html element and attach it to the webpage
    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    var engine = new Engine(canvas, true);
    var scene = new Scene(engine);


    var camera = new FollowCamera("FollowCam", new Vector3(0, 10, -100), scene);
	
    //The goal distance of camera from target
    camera.radius = 30;
    
    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 10;
    
    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;
    
    //Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.005
    
    //The speed at which acceleration is halted 
    camera.maxCameraSpeed = 10
    
    //camera.target is set after the target's creation
      

    camera.attachControl();
    var light1: HemisphericLight = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      scene
    );

  
    universe.render(scene,camera);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === "i") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();

     universe.tic();
    });
  }
}
new App();
