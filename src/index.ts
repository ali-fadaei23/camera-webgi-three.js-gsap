import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  ScrollableCameraViewPlugin,
  //   addBasePlugins,
  CanvasSnipperPlugin,
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false,
  });

  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;
  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm));
  await viewer.addPlugin(ScrollableCameraViewPlugin);
  //   await viewer.addPlugin(GammaCorrectionPlugin)
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  //   await viewer.addPlugin(DiamondPlugin)
  //   await viewer.addPlugin(FrameFadePlugin)
  //   await viewer.addPlugin(GLTFAnimationPlugin)
  //   await viewer.addPlugin(GroundPlugin)
  //   await viewer.addPlugin(BloomPlugin);
  //   await viewer.addPlugin(TemporalAAPlugin)
  //   await viewer.addPlugin(AnisotropyPlugin)
  // and many more...

  viewer.renderer.refreshPipeline();
  // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.

  await viewer.addPlugin(CanvasSnipperPlugin);

  // Import and add a GLB file.
  await viewer.load("./assets/ship.glb");

  function setupScrollAnimation() {
    const tl = gsap.timeline();

    // First section
    tl.to(position, {
      x: -4.51,
      y: 1.71,
      z: -3.0,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top 90%",
        scrub: true,
        markers: true,
        immediateRender: false,
      },
      duration: 4,
      onUpdate,
    })
      .to(".section--content", {
        xPercent: "-150",
        opacity: 0,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top 40%",
          scrub: 1,
          markers: true,
          immediateRender: false,
        },
        duration: 4,
        onUpdate,
      })
      .to(target, {
        x: -0.69,
        y: -0.0014,
        z: 0.91,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          markers: true,
          immediateRender: false,
        },
        duration: 4,
        onUpdate,
      });
    // second section
    tl.to(position, {
      x: 0.48,
      y: -0.59,
      z: 2.21,
      scrollTrigger: {
        trigger: ".third",
        start: "top bottom",
        end: "top top",
        scrub: 2,
        markers: true,
        immediateRender: false,
      },
      duration: 7,
      onUpdate,
    })
      .to(".section--two--container", {
        yPercent: "-100",
        opacity: 0,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          markers: true,
          immediateRender: false,
        },
        duration: 4,
        onUpdate,
      })
      .to(target, {
        x: 0.132,
        y: -0.8,
        z: 0.2,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          markers: true,
          immediateRender: false,
        },
        duration: 7,
        onUpdate,
      });

    // last section

    tl.to(position, {
      x: -1.41,
      y: -0.30,
      z: -3.01,
      scrollTrigger: {
        trigger: ".last",
        start: "top bottom",
        end: "top top",
        scrub: true,
        markers: true,
        immediateRender: false,
      },
      duration: 4,
      onUpdate,
    }).to(target, {
      x: 1.91,
      y: -1.31,
      z: 0.05,
      scrollTrigger: {
        trigger: ".last",
        start: "top bottom",
        end: "top top",
        scrub: true,
        markers: true,
        immediateRender: false,
      },
      duration: 4,
      onUpdate,
    });
  }

  setupScrollAnimation();

  // webGI Update
  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    viewer.renderer.resetShadows();
  }

  await viewer.doOnce("preFrame", () => {
    if (needsUpdate) {
      camera.positionUpdated(false);
      camera.targetUpdated(true);
      needsUpdate = false;
    }
  });
}

setupViewer();
