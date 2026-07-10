(function () {
  const container = document.getElementById("hero-candle-smoke");
  const hero = document.querySelector(".hero");
  if (!container || !hero) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SMOKE_TEXTURE_URL =
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png";
  const MOBILE_BREAKPOINT = 980;
  const PARTICLE_COUNT = 150;
  const CAMERA_Z = 1000;

  let renderer;
  let scene;
  let camera;
  let clock;
  let smokeParticles = [];
  let smokeGeometry = null;
  let smokeMaterial = null;
  let animationId = 0;
  let running = false;

  function canRun() {
    return window.innerWidth > MOBILE_BREAKPOINT && typeof THREE !== "undefined";
  }

  function getStageSize() {
    return {
      width: hero.clientWidth || window.innerWidth,
      height: hero.clientHeight || window.innerHeight,
    };
  }

  function getSmokeAnchor(width, height) {
    return {
      x: width * 0.5,
      y: height * 0.46,
    };
  }

  function screenToWorld(x, y, width, height) {
    const fov = (75 * Math.PI) / 180;
    const worldHeight = 2 * Math.tan(fov / 2) * CAMERA_Z;
    const worldWidth = worldHeight * (width / height);

    return {
      x: (x / width - 0.5) * worldWidth,
      y: -(y / height - 0.5) * worldHeight,
    };
  }

  function placeParticles(width, height) {
    const anchor = getSmokeAnchor(width, height);
    const world = screenToWorld(anchor.x, anchor.y, width, height);

    smokeParticles.forEach((particle) => {
      particle.position.set(
        world.x + Math.random() * 560 - 280,
        world.y + Math.random() * 480 - 240,
        Math.random() * 1000 - 100
      );
      particle.rotation.z = Math.random() * Math.PI * 2;
    });
  }

  function initScene() {
    if (!canRun() || renderer) return;

    const { width, height } = getStageSize();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = CAMERA_Z;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const smokeTexture = loader.load(SMOKE_TEXTURE_URL);

    smokeGeometry = new THREE.PlaneGeometry(300, 300);
    smokeMaterial = new THREE.MeshBasicMaterial({
      color: 0xe8e8e8,
      map: smokeTexture,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });

    smokeParticles = [];

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const particle = new THREE.Mesh(smokeGeometry, smokeMaterial);
      scene.add(particle);
      smokeParticles.push(particle);
    }

    placeParticles(width, height);

    clock = new THREE.Clock();
    running = true;
    animate();
  }

  function evolveSmoke(delta) {
    let index = smokeParticles.length;
    while (index--) {
      smokeParticles[index].rotation.z += delta * 0.2;
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  function animate() {
    if (!running || !renderer) return;

    animationId = window.requestAnimationFrame(animate);
    const delta = clock.getDelta();
    evolveSmoke(delta);
    render();
  }

  function destroyScene() {
    running = false;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = 0;
    }

    smokeParticles.forEach((particle) => {
      scene?.remove(particle);
    });
    smokeParticles = [];

    if (smokeMaterial) {
      smokeMaterial.dispose();
      smokeMaterial = null;
    }

    if (smokeGeometry) {
      smokeGeometry.dispose();
      smokeGeometry = null;
    }

    if (renderer) {
      renderer.dispose();
      container.innerHTML = "";
      renderer = null;
    }

    scene = null;
    camera = null;
    clock = null;
  }

  function resizeScene() {
    if (!canRun()) {
      destroyScene();
      return;
    }

    if (!renderer) {
      initScene();
      return;
    }

    const { width, height } = getStageSize();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    placeParticles(width, height);
  }

  function boot() {
    if (canRun()) initScene();
  }

  if (document.readyState === "complete") {
    boot();
  } else {
    window.addEventListener("load", boot, { once: true });
  }

  window.addEventListener("resize", resizeScene);

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(resizeScene);
    resizeObserver.observe(hero);
  }
})();
