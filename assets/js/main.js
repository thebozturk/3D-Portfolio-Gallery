// ## Title: THREE JS game style immersive slider selection screen
// ## Author: Jamie Coulter
// ## Date: 10/03/2017

// ## Let"s get everything set up
var scene,
  camera,
  cameraControls,
  can_click = 1,
  position = 0,
  spotLight,
  particles = [],
  Lights = [],
  gems = [];

// ## Let"s load in our audio
crateSmash = new Audio(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/31622__srehpog__light-crate-smash1.wav"
); // Crate bump
bg = new Audio("https://www.jamiecoulter.co.uk/bensound-betterdays.mp3"); // Background music
bgEffect = new Audio("https://www.jamiecoulter.co.uk/wooden.mp3"); // Background creaks
menuclick = new Audio(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/menuclick.wav"
); // Arrow click sound effect
slide = new Audio("https://www.jamiecoulter.co.uk/slide.mp3"); // Transition sound

// ## Scene options
wireframe = false; // Set to true to see object wireframes
audio = true; // Set to false if audio doing head in

sceneLoadDelay = 500; // Delay from when fully loaded to fade in scene

cameraX = 11; // Camera x position
cameraY = 1; // Camera y position
cameraZ = 11; // Camera z position
cameraZoom = 2; // Camera zoom value
cameraMoveDelay = 0.5; // Delay after left/right clicked before the cam moves
cameraMoveSpeed = 1.2; // How fast cam moves to next crate

crateOffset = 20; // How far each crate is apart
sceneOffset = 1; // The scene offset

sceneBg = "black"; // The scene global color

globalAmbienceIntensity = 0.06; // Set general ambience
globalAmbienceColor = "#d39cf3"; // General ambience color

spotLightColor = "#ab4fcd";
spotLightIntensity = 10;

floorWidth = 200; // Width of the grass floor
floorHeight = 100; // Height of the grass floor

parallaxSeperation = 1; // Distance between back drop panels
parallaxMidModifier = 3; // Parallax sensitivity

rockAnimationDelay = 0.6; // Delay after click until crate rocks

rockAnimationDurationOne = 0.56; // Stage one rock duration
rockAnimationRotationOne = -0.93; // Stage one rock amount

rockAnimationDurationTwo = 0.2; // Stage two rock duration
rockAnimationRotationTwo = 0; // Stage two rock amount

rockAnimationDurationThree = 0.27; // Stage three rock duration
rockAnimationRotationThree = 0.25; // Stage three rock amount

rockAnimationDurationFour = 0.12; // Stage four rock duration
rockAnimationRotationFour = 0; // Stage four rock amount

rockAnimationDurationFive = 0.1; // Stage five rock duration
rockAnimationRotationFive = -0.1; // Stage five rock amount

rockAnimationDurationSix = 0.05; // Stage six rock duration
rockAnimationRotationSix = 0; // Stage one six amount

smokeAmount = 40; // How many smoke particles per crate
smokeDelay = 1000; // Delay after click until smoke burst

particleAmount = 1000; // Global particle count
particleMaxSize = 15; // Max particle size

gemAmount = 50; // Gems per crate
gemScale = 0.001; // Gem size
gemColor = "green";

menuclick.volume = 0.3; // Sample volume for arrow click
bgEffect.volume = 0.3; // Background effects volume
bgEffect.loop = true; // Loop background effect
bg.volume = 0.2; // Background music volume
crateSmash.volume = 0.4; // Crate bang volume
slide.volume = 0.2; // Slide transition sound volume
string = "3%ferf$£%UY5£$&&^&jtgjHYJg";
slidePlayDelay = 500; // Delay from click until slide is played

// ## Create a function to play our sounds
function playSound(sound) {
  if (audio) {
    sound.play(); // Play sound
  }
}

function loading(text, percent, done) {
  if (percent) $(".loader_inner").css("width", percent + "%"); // Change width of loader

  if (text) {
    $(".loader .description").text(text);
  }

  if (done) {
    $(".loader").fadeOut(); // Fade loader out
    setTimeout(function () {
      //   $("#canvas,.ui").fadeIn(); // Fade in our scene
      playSound(bg); // Play background music
      playSound(bgEffect); // Play background effects

      setTimeout(() => {
        $(".home-page").css("display", "flex");
      }, 300);
    }, sceneLoadDelay);

    $(document).on("mousemove", function (e) {
      var x = -(($(window).innerWidth() / 2 - e.pageX) / 6000) + cameraX; // Get current mouse x
      var y = -(($(window).innerWidth() / 2 - e.pageY) / 6000 - cameraY); // Get current mouse x
      camera.position.x = x; // Update cam x
      camera.position.y = y; // Update cam y
    });
  }
}

// ## Scene options
THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
  const percent = (loaded / total) * 100; // Figure our percent loaded
  let isLoaded = false;
  if (loaded == total) isLoaded = true;
  loading("Schema is loading", percent, isLoaded);
};

function startScene() {
  // ## Set up the canvas
  var canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
    container = document.getElementById("canvas");

  // ## Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(sceneBg); // Set the background color of our scene

  // ## Let"s get some light into the scene
  ambientLight = new THREE.AmbientLight(
    globalAmbienceColor,
    globalAmbienceIntensity
  ); // Create an ambient light source
  scene.add(ambientLight); // Now add the light to our scene

  for (i = 0; i < 4; i++) {
    l = new THREE.PointLight(spotLightColor, 20, 10, 4, spotLightIntensity); // Create a PointLight
    l.position.set(5, 4, -i * crateOffset); // Position this light
    l.castShadow = true;
    scene.add(l); // Add all lights to the scene
  }

  // ## Set up the camera
  camera = new THREE.PerspectiveCamera(
    45,
    canvasWidth / canvasHeight,
    1,
    13000
  ); // Create a new camera
  camera.lookAt(scene.position); // Point it at our scenes origin
  camera.position.set(cameraX, cameraY, cameraZ); // Position it to liking
  camera.zoom = cameraZoom; // Zoom in a bit
  camera.updateProjectionMatrix(); // Needs to be called as we have updated the camera position

  // ## Create a new WebGl Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMapEnabled = true; // Enable shadow maps
  renderer.shadowMapType = THREE.PCFSoftShadowMap; // Soft shadows
  container.appendChild(renderer.domElement); // Append renderer

  // ## Window resize event
  window.addEventListener("resize", onWindowResize, false);

  // ## Orbital controls
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

  // ## Let"s create a constructor for our meshes
  object = function () {
    THREE.Mesh.apply(this, arguments);
  };

  object.prototype = Object.create(THREE.Mesh.prototype);
  object.prototype.constructor = object;
  object.verticesNeedUpdate = true; // Needed to update anchor points

  // ## Load in our textures
  THREE.ImageUtils.crossOrigin = "";

  // Grass
  grassTexture = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/cartoon_grass.jpg"
  );
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; // Allow texture wrapping
  grassTexture.repeat.set(40, 100); // Repeat the grid texture

  // Forest
  forestFrontTexture = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/forestPanelFront.png"
  );
  forestFrontTexture.wrapS = forestFrontTexture.wrapT = THREE.RepeatWrapping; // Allow texture wrapping
  forestFrontTexture.repeat.set(10, 1); // Repeat the grid texture

  // Forest Mid
  forestMidTexture = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/forestPanelMid.png"
  );
  forestMidTexture.wrapS = forestMidTexture.wrapT = THREE.RepeatWrapping; // Allow texture wrapping
  forestMidTexture.repeat.set(10, 1); // Repeat the grid texture

  // Particles
  particleTexture = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/particleTexture.png"
  );

  // Crate textures
  crateTexture = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/create4texture.png"
  );
  crateTexture2 = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/crate2.png"
  );
  crateTexture3 = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/crate5.jpg"
  );
  crateTexture4 = THREE.ImageUtils.loadTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/crate3.jpg"
  );

  // ## Create our materials
  smokeMaterial = new THREE.MeshPhongMaterial({
    // Smoke
    shading: THREE.SmoothShading,
    color: "white",
    transparent: true,
    opacity: 0,
  });
  particleMaterial = new THREE.MeshPhongMaterial({
    // Particles
    shading: THREE.SmoothShading,
    transparent: true,
    color: "white",
    map: particleTexture,
  });
  forestMaterialFront = new THREE.MeshPhongMaterial({
    // Forest front panel
    map: forestFrontTexture,
    transparent: true,
    shininess: 0,
  });
  forestMaterialMid = new THREE.MeshPhongMaterial({
    // Forest panel mid
    color: "#bd137b",
    map: forestMidTexture,
    transparent: false,
  });
  grassMaterial = new THREE.MeshPhongMaterial({
    // Grass
    color: "#730549",
    shading: THREE.SmoothShading,
    map: grassTexture,
    shininess: 0,
  });
  crateMaterial = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture,
  });
  crateMaterial2 = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture2,
  });
  crateMaterial3 = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture3,
  });
  crateMaterial4 = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture4,
  });

  // ## Check if wireframe
  if (wireframe) {
    crateMaterial.wireframe =
      grassMaterial.wireframe =
      smokeMaterial.wireframe =
      forestMaterialMid =
      forestMaterialFront =
        true;
  }

  // ## Create our scene objects

  // Floor
  var floorGeometry = new THREE.PlaneGeometry(floorHeight, floorWidth, 20, 20);
  var floor = new object(floorGeometry, grassMaterial);

  floor.rotation.x = -Math.PI / 2; // Rotate floor
  floor.position.set(0, 0, -70); // Position floor
  floor.receiveShadow = true; // Let floor receive shadows

  scene.add(floor); // Add it to our scene

  // Forest background panels
  var forestPanelFrontGeometry = new THREE.PlaneGeometry(
    floorWidth + 30,
    34,
    120,
    20
  );
  forestPanelFront = new object(forestPanelFrontGeometry, forestMaterialFront);
  forestPanelMid = new object(forestPanelFrontGeometry, forestMaterialMid);
  forestPanelMid.position.set(0, 0, -parallaxSeperation);

  var forest = new THREE.Object3D();
  forest.rotation.y = Math.PI / 2;
  forest.position.set(-floorHeight / 2, 7, -70);
  forest.add(forestPanelFront, forestPanelMid);

  scene.add(forest);

  // ## Create geometries for each crate
  var crateOneGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
  var crateTwoGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
  var crateThreeGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
  var crateFourGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);

  // ## Create meshes using our constructor
  var crateOne = new object(crateOneGeo, crateMaterial);
  var crateTwo = new object(crateTwoGeo, crateMaterial2);
  var crateThree = new object(crateThreeGeo, crateMaterial3);
  var crateFour = new object(crateFourGeo, crateMaterial4);

  // ## Lets create an array store all our crates
  crates = [];
  crates.push(crateOne, crateTwo, crateThree, crateFour); // Push objects to array

  // ## Make smoke geometry
  var smokeGeo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

  // ## Loop over our crates and add them into the scene
  for (i = 0; i < crates.length; i++) {
    crates[i].geometry.translate(0, 1, 1); // 0, 1, 1
    crates[i].position.set(0, 0, -i * crateOffset + sceneOffset);
    crates[i].castShadow = true; // Make crate cast shadows
    for (a = 0; a < smokeAmount; a++) {
      s = new object(smokeGeo, smokeMaterial);
      num = Math.random() * -2 + 1;
      s.position.set(num, -0.35, 0);
      s.scale.set(0.3, 0.3, 0.3);
      makeSmoke(s);
      crates[i].add(s);
    }
    // scene.add(crates[i]); // Add them all to our scene
  }

  var light = new THREE.PointLight(0xffffff, 1, 0);

  // Specify the light's position
  light.position.set(1, 1, 100);

  // Add the light to the scene
  scene.add(light);

  // ## Create atmosphere particles
  for (i = 0; i < particleAmount; i++) {
    var psize = (Math.random() * particleMaxSize) / 100; // Create a random particle size
    var p = new THREE.CircleGeometry(psize, psize, psize); // Create the particle geometry
    pm = new object(p, particleMaterial); // Creat the particle mesh
    pm.position.set(
      -Math.random() * 50 + 20,
      Math.random() * 7,
      -Math.random() * 100 + 10
    ); // Position random
    particles.push(pm); // Push particles to an array
    scene.add(pm); // Add the particles to our scene
  }

  // ## Make Gems
  /* var loader = new THREE.ObjectLoader();

    loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/gems.json", function(obj) {
        var materialObj = new THREE.MeshBasicMaterial({ // Create gem mesh
            vertexColors: THREE.FaceColors,
            overdraw: 0.5
        });
        g = new THREE.MeshPhongMaterial({ // Creat gem material
            color: gemColor,
            side: THREE.DoubleSide
        });
        obj.traverse(function(child) { // Traverse child and change the materials to new onw
            if (child instanceof THREE.Mesh) {
                child.material = g;
            }
        });
        for (i = 0; i < crates.length; i++) { // Add our gems
            for (t = 0; t < gemAmount; t++) {
                var s = obj.clone(); // Clone master gem object
                s.rotation.x = 90 * (Math.PI / 180); // Rotate it
                s.rotation.z = (Math.random() * 200) * (Math.PI / 180); // Rotate randomly
                s.position.set((Math.random() * 4) - 2, 0, -((i * crateOffset)) - Math.random() * 2 + 5); // Position randomly
                s.scale.set(gemScale, gemScale, gemScale); // Set the gem scale
                scene.add(s); // Add gems to the scene
            }
        }
    });

*/
  // ## Reposition scene
  scene.position.set(0, -1, 0);
}

// ## Now lets create a timeline for each crate then store it in an array
function timelines() {
  for (i = 0; i < crates.length; i++) {
    var obj = crates[i];
    var translate = obj.geometry.parameters.width;
    var position = translate / 2 - i * crateOffset + sceneOffset + 1;
    var positionOpposite = -(translate / 2 + i * crateOffset - sceneOffset) + 1;
    var tl = new TimelineMax({
      delay: rockAnimationDelay,
    });
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationOne, {
        x: rockAnimationRotationOne,
        ease: Circ.easeInOut,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationTwo, {
        x: rockAnimationRotationTwo,
        onComplete: switchAnchor,
        onCompleteParams: [obj, -translate, position, 0],
        ease: Expo.easeIn,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationThree, {
        x: rockAnimationRotationThree,
        ease: Expo.easeOut,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationFour, {
        x: rockAnimationRotationFour,
        onComplete: switchAnchor,
        onCompleteParams: [obj, translate, positionOpposite, 0],
        ease: Expo.easeIn,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationFive, {
        x: rockAnimationRotationFive,
        ease: Expo.easeOut,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationSix, {
        x: rockAnimationRotationSix,
        onComplete: switchAnchor,
        onCompleteParams: [obj, 0, positionOpposite, 1],
        ease: Expo.easeIn,
      })
    );
  }
}

smokeAnims = [];
// ## Create smoke
function makeSmoke(obj) {
  stl = new TimelineMax({});
  stl.add([
    TweenLite.to(obj.scale, 0.5, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      ease: Expo.easeOut,
    }),
    TweenLite.fromTo(
      obj.material,
      0.5,
      {
        opacity: 1,
      },
      {
        opacity: 0,
      }
    ),
    TweenLite.to(obj.position, 0.5, {
      x: obj.position.x,
      y: 0.02 + Math.random() * 1.3,
      z: obj.position.z + Math.random() * 1.3,
      ease: Expo.easeOut,
    }),
  ]);
  smokeAnims.push(stl);
  stl.stop();
}

function playSmoke() {
  for (i = 0; i < smokeAnims.length; i++) {
    let s = smokeAnims[i];
    setTimeout(function () {
      s.restart();
    }, 1400);
  }
}

// ## Switch crate anchor
function switchAnchor(object, tZ, pZ, int) {
  playSound(crateSmash); // Play crate sound
  object.geometry.translate(0, 0, tZ); // Change crate translation
  object.position.set(0, 0, pZ); // Chage crate position
  can_click = int; // Allow user to click again
}

// ## Animate the scene
function animateScene() {
  requestAnimationFrame(animateScene);
  render();
}

// ## Start everything up!

async function threeJsInit() {
  // await getGithubInformation();
  startScene();
  animateScene();
}

// ## Window resize
function onWindowResize() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;
  renderer.setSize(canvasWidth, canvasHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  render();
}

// ## Crate information array
crateInfoArray = [
  {
    name: "Noob loot crate", // First crate
    text: "You probably wont get much in this loot crate to be honest, but what can you expect for such a low cost?",
    price: "20,000",
  },
  {
    name: "Novice loot crate", // Second crate
    text: "This loot crate will contain a few relatively decent items that you can show off to your friends",
    price: "49,999",
  },
  {
    name: "Pro loot crate", // Third crate
    text: "Now we are talking, this crate contains loot for the professional player, weapons and items galore",
    price: "119,999",
  },
  {
    name: "God loot crate", // Fourth crate
    text: "Takes pay to win to a new level. Destroy your oppenents with this ultimate loot crate. Instawin",
    price: "999,999",
  },
];

// ## Update info box content
function crateInfo(crate) {
  $(".box").fadeOut(function () {
    // fade box out then...
    $(".box_inner__title").text(crateInfoArray[crate].name); // Change crate name
    $(".box_inner__text").text(crateInfoArray[crate].text); // Change crate description
    $(".box_inner__cost .right").text(crateInfoArray[crate].price); // Change crate Cost
  });
  setTimeout(function () {
    $(".box").fadeIn(); // Fade box back in
  }, 2000);
}

// ## Create a function that will animate the camera along the z axis
function moveCamera(amount) {
  var z = camera.position.z; // Init z
  var move = z + amount; // What point to move to
  TweenMax.to(camera.position, cameraMoveSpeed, {
    // Animate camera to point
    z: move,
    ease: Expo.easeInOut,
    delay: cameraMoveDelay,
  });
  TweenMax.to(forestPanelMid.position, cameraMoveSpeed, {
    // Animate camera to point
    x: forestPanelMid.position.x - amount / parallaxMidModifier,
    ease: Expo.easeInOut,
    delay: cameraMoveDelay,
  });
  setTimeout(function () {
    playSound(slide);
  }, slidePlayDelay);
}

// ## User interaction
$(".button").click(function () {
  playSound(menuclick); // Play menu click sound
  if (can_click == 1 && $(this).hasClass("left") && position > 0) {
    moveCamera(crateOffset); // Move the camera
    position--; // Decrease our position in the slider
    crateInfo(position); // Update crate info
  } else if (
    can_click == 1 &&
    $(this).hasClass("right") &&
    position < crates.length - 1
  ) {
    can_click = 0; // First of all lets stop the user from clicking again and messing things up
    moveCamera(-crateOffset); // Move the camera
    position++; // Increase our position in the slider
    timelines(); // Play the animation of the crate rocking
    playSmoke(); // Play smoke
    crateInfo(position); // Update crate info
  }
});

// ## Go
function render() {
  p = 0;
  $.each(particles, function () {
    // Each particle in our array
    particles[p].position.y += (Math.random() * 10) / 1000; // Update the y position
    if (particles[p].position.y > 7) {
      // If its out of view...
      particles[p].position.y = 0; // Reset particle position
    }
    p++;
  });
  renderer.render(scene, camera); // Render
}

function deep_ui() {
  var global_perspective = 800; // Global perspective set to parent
  var pivot = 50; // The higher this number the more subtle the pivot effect
  var debug = false; // Shows various debug information
  var animation_delay = 100; // Delay before animation starts cannot be 0. In ms.
  var animation_easing = "ease"; // Animation easing
  var deep_parent = $("*[data-deep-ui='true']"); // Parent with deep active
  var deep_element = $("[data-depth]"); // Elements with depth
  deep_parent.each(function () {
    $(this).css({
      perspective: global_perspective + "px",
      "transform-style": "preserve-3d",
    });
    set_depth();
  });

  function set_depth() {
    deep_element.each(function () {
      $(this).css({
        transform: "translatez(" + $(this).data("depth") + "px)",
        "transform-style": "preserve-3d", // Set CSS to all elements
      });
    });
  }
  $(document).on("mousemove", function (e) {
    var x = -($(window).innerWidth() / 2 - e.pageX) / pivot; // Get current mouse x
    var y = ($(window).innerHeight() / 2 - e.pageY) / pivot; // Get current mouse y
    deep_parent.css("transform", "rotateY(" + x + "deg) rotateX(" + y + "deg)"); // Set parent element rotation
  });
}

// Init

deep_ui();
threeJsInit();

// Full screen mode
function fullscreen() {
  document.documentElement.webkitRequestFullscreen();
  document.documentElement.mozRequestFullScreen();
  document.documentElement.msRequestFullscreen();
  document.documentElement.requestFullscreen();
}

$(".fullscreen").click(function () {
  fullscreen();
});

// ## Analyze user's github information
async function getGithubInformation() {
  const username = "tolgaand";

  const repositorys = [];

  loading("Get github informations.", null, false);

  const response = await (
    await fetch(`https://api.github.com/users/${username}/repos`)
  ).json();

  for (let i = 0; i < response.length; i++) {
    const repository = response[i];
    const repositoryObject = {};

    loading(`Analyze ${repository.name} repository`, i + 5, false);

    repositoryObject["name"] = repository.name;
    repositoryObject["description"] = repository.description;
    repositoryObject["homepage"] = repository.homepage;
    repositoryObject["languages"] = {};

    // ## Get Language
    const repositoryLanguages = await (
      await fetch(
        `https://api.github.com/repos/${username}/${repository.name}/languages`
      )
    ).json();

    for (const property in repositoryLanguages) {
      if (repositoryObject["languages"][property])
        repositoryObject["languages"][property] +=
          repositoryLanguages[property];
      else
        repositoryObject["languages"][property] = repositoryLanguages[property];
    }
    repositorys.push(repositoryObject);
  }

  loading("OK github informations.", 10, false);
}
