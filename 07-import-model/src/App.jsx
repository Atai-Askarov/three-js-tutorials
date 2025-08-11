import { useState, useEffect, useRef } from 'react';
import SpatialGrid from './SpatialGrid';
import * as THREE from 'three';
import { getWindowDimensions, setUpScene } from './utils/environmentUtils';
import Boid from './Boid';
import { animate} from './utils/animationUtils';
import { Sky } from 'three-stdlib';
import { MathUtils, Vector3 } from 'three';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/Portfolio';
import SkillsSection from './components/Skills';
import ContactSection from './components/ContactSection';
import { birdStateManager } from './birdStateManager';
import { foldAction } from './utils/animationUtils';

function App() {
  const sceneRef = useRef(null);
  const coveredRef = useRef(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [grid, setGrid] = useState(null);
  const birdsRef = useRef(null); 
  const paperGridRef = useRef(false);
  const projectSectionRef = useRef(null); // <-- NEW

  async function handleResumeClick() {

  }

  const createFlock = async (scene, grid, camera, paperGridRef) => {
    try {
      const boid = await Boid.create(true, scene); // Create leader boid
      if (grid) {
        const { boids, mixers } = await copyAndAddBoids(boid, scene, grid);
        if (camera && paperGridRef) {
          await animate(boids, mixers, camera, paperGridRef, scene);
        }
      }
    } catch (error) {
      console.error('Failed to create boid:', error);
    }
  };

  const copyAndAddBoids = async (leader, scene, grid, count = 190) => {
    const followerPromises = Array.from({ length: count - 1 }, () => Boid.copyBoid(leader));
    const followerBoids = await Promise.all(followerPromises);
    birdsRef.current = [leader, ... followerBoids];
    if (grid) {
      grid.insert(leader);
      followerBoids.forEach(cloneBoid => grid.insert(cloneBoid));
    }

    let mixers = [];
    followerBoids.forEach(follower => {
      if (follower && follower.blenderData?.mesh) {
        mixers.push(follower.mixer);
        scene.scene.add(follower.blenderData.mesh);
      }
    });

    const allBoids = [leader, ...followerBoids];
    const allMixers = [leader.mixer, ...mixers];

    let nearbyMap = new Map();
    if (grid?.getNearbyBoids) {
      allBoids.forEach(boid => {
        const nearby = grid.getNearbyBoids(boid);
        nearbyMap.set(boid, nearby);
      });
    }

    return { boids: nearbyMap, mixers: allMixers };
  };

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {
    let { scene } = setUpScene();
    sceneRef.current = scene;
    setGrid(new SpatialGrid(windowDimensions));

    const sky = new Sky();
    sky.scale.setScalar(450000);
    sky.material.uniforms.turbidity.value = 3.8;
    sky.material.uniforms.rayleigh.value = 1.689;
    sky.material.uniforms.mieCoefficient.value = 0.073;
    sky.material.uniforms.mieDirectionalG.value = 0.803;
    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(-151.9);
    const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms.sunPosition.value.copy(sunPosition);
    if (scene.renderer) {
      scene.renderer.toneMappingExposure = 0.1641;
    }
    scene.scene.add(sky);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowDimensions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(entry.isIntersecting)
        console.log(coveredRef.current)
        if (entry.isIntersecting) {
          const gridBirds = birdsRef.current.slice(0, 8);
          for(let i = 0; i < gridBirds.length; i++){
            const bird = gridBirds[i];
            birdStateManager.subscribe(bird);
          }
            birdStateManager.setState("GRID_FORMATION");
            birdStateManager.notifySubscribers();
        }
        
        else{
          console.log("you have arrived")
          birdStateManager.setState("FLOCKING");
          birdStateManager.notifySubscribers();
          birdStateManager.returnSubscribers().forEach(bird => foldAction(bird));
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px', // triggers when it's about 70% into view
        threshold: 1,
      }
    );

    if (projectSectionRef.current) {
      observer.observe(projectSectionRef.current);
    }

    return () => observer.disconnect();
  }, [coveredRef.current]);

  useEffect(() => {
    if (grid && sceneRef.current) {
      createFlock(sceneRef.current, grid, sceneRef.current.camera, paperGridRef, sceneRef.current);
    }
  }, [grid]);

  // NEW: Trigger logic when ProjectsSection enters viewport
  

  return (
    <div style={{ position: "relative", width: "100vw" }}>
      <canvas
        id="myThreeJsCanvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <NavBar />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          overflowY: "scroll",
          height: "100vh",
          width: "100vw",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
      >
        <section style={{ height: "100vh", scrollSnapAlign: "start" }}>
          <HeroSection onCVClick={handleResumeClick} />
        </section>

        <section
          ref={projectSectionRef}
          style={{ height: "100vh", scrollSnapAlign: "start" }}
        >
          <ProjectsSection />
        </section>

        <section style={{ height: "100vh", scrollSnapAlign: "start" }}>
          <SkillsSection />
        </section>

        <section style={{ height: "100vh", scrollSnapAlign: "start" }}>
          <ContactSection />
        </section>
      </div>
    </div>
  );
}

export default App;
