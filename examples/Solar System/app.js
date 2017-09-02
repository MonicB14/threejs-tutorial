/*
@Author : Monic Bhanushali

Libraries Used: three.js
                Stats.js
                SPE.js

Creating a solar system with Sun,Earth and Moon.
To run this App, you will need an HTTP server running locally.
HTTP server is essential for the textures to load on screen.

To Download HTTP-Server using npm execute below command:
"npm install http-server -g"

To start an http-server:
"http-server.cmd"

Debug using browser Developer Tools.

*/
var solarSystem  = (function (){
  "use strict";

  var camera,
      scene = new THREE.Scene(),
      renderer = new THREE.WebGLRenderer({ antialias: true }),
      clock = new THREE.Clock(),
      deltaTime,
      sun,
      moon,
      moonPivot,
      earth,
      textureLoader = new THREE.TextureLoader(),
      starField,
      solarflames,
      stats = new Stats();

  function init() {

    //Creating a Scene
    scene.background = new THREE.Color( 0x000000 );

    //Creating a Camera
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0,0,100);

    //Creating TextureLoader
    //textureLoader = new THREE.TextureLoader();

    //Creating Space system-container
    /*
    particleSystem = createSpaceSystem();
    scene.add(particleSystem);
    */

    //Creating Sun
    var sungeometry = new THREE.SphereGeometry(7,60,60);
    var suntexture = new textureLoader.load('../../textures/suntexture.jpg');
    var sunmaterial = new THREE.MeshBasicMaterial({map:suntexture});
    sun = new THREE.Mesh(sungeometry, sunmaterial);
    sun.position.set(0,0,0);
    scene.add(sun);

    //Creating Moon's Pivot
    moonPivot = new THREE.Object3D();

    //Creating Earth
    var earthgeometry = new THREE.SphereGeometry( 2.5,50,50 );
    var earthtexture = new textureLoader.load('../../textures/earthmap.jpg');
    var earthmaterial = new THREE.MeshBasicMaterial( {map:earthtexture} );
    earth = new THREE.Mesh( earthgeometry, earthmaterial );
    earth.position.set(-50,0,0);
    earth.add(moonPivot);
    scene.add(earth);

    //Creating moon
    var moongeometry = new THREE.SphereGeometry(1,50,50);
    var moontexture = new textureLoader.load('../../textures/moon.jpg');
    var moonmaterial = new THREE.MeshBasicMaterial( {map:moontexture} );
    moon = new THREE.Mesh( moongeometry, moonmaterial );
    moon.position.set(-5,0,0);
    moonPivot.add(moon);

    //Creating Space stars field
    var starsGeometry = new THREE.Geometry();
    for ( var i = 0; i < 10000; i ++ ) {
    	var star = new THREE.Vector3();
    	star.x = THREE.Math.randFloatSpread( 2000 );
    	star.y = THREE.Math.randFloatSpread( 2000 );
    	//star.z = THREE.Math.randFloatSpread( 2000 );
      star.z = -200;
    	starsGeometry.vertices.push( star )
    }
    var starsMaterial = new THREE.PointsMaterial({color:0x888888 } )
    starField = new THREE.Points( starsGeometry, starsMaterial );
    scene.add( starField );

    /*
    Below code is used help with the Axis of each object.
    Uncomment it to view the axes of each object on screen.
    */
    /*
    var earthAxis = new THREE.AxisHelper(50);
    earth.add(earthAxis);
    var sceneAxis = new THREE.AxisHelper(300);
    scene.add(sceneAxis);
    scene.add( earthAxis );
    */


    setStats();

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("system-container").appendChild(renderer.domElement);
    document.getElementById("system-container").appendChild(stats.domElement);


    animate();
  }

  //Function to provide App statistics.
  function setStats(){
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

  }


  function startSolarFlames() {
          	solarflames = new SPE.Group({
          		texture: {
                      value: new textureLoader.load('../../textures/sunflares.jpg')
                  },
                maxParticleCount : 3000
          	});
                  var emitter = new SPE.Emitter({
                      type: 2,
                      maxAge: {
                          value: 3
                      },
                      position: {
                          value: new THREE.Vector3(0, 0, 0),
                          radius: 1.5
                      },

                      velocity: {
                          value: new THREE.Vector3(2,2,2),
                          distribution: SPE.distributions.SPHERE
                      },
                     size: {
                          value: 2
                      },
                      particleCount: 800
                  });
                  solarflames.addEmitter( emitter );
          	scene.add( solarflames.mesh );
          }



  //This function will start the actual animation.
  function animate( time ) {

    deltaTime = clock.getDelta();
    solarflames.tick(deltaTime);

    earth.rotation.y = time * 0.0001;
    sun.rotation.y = time*0.0001;
    moon.rotation.y = time*0.0001;
    moonPivot.rotation.y = time*0.0004;
    revolveObject(earth, 0.001);


    renderer.render( scene, camera );
    requestAnimationFrame( animate );

    stats.update();
  }

  //Function to make the specified object revolve around the Y axis.
  function revolveObject(object, theta){
      //amount to rotate by
      //var theta = 0.001;
      var x = object.position.x;
      var z = object.position.z;

      object.position.x = x * Math.cos(theta) + z * Math.sin(theta);
      object.position.z = z * Math.cos(theta) - x * Math.sin(theta);
  }

//Function to animate the particle system
/*
function animateStarField() {
    var verts = starField.geometry.vertices;
    for(var i = 0; i < verts.length; i++) {
        var vert = verts[i];
        if (vert.y < -200) {
            vert.y = Math.random() * 400 - 200;
        }
        vert.y = vert.y - (10 * deltaTime);
    }
    starField.geometry.verticesNeedUpdate = true;
}
*/

  window.onload = startSolarFlames(),init();

  // This return statement is use for debugging purpose.
  return {
    scene: scene
  }

})();
