import { useEffect } from 'react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import SceneInit from './lib/SceneInit';


function App() {
  
  let test = undefined;
  useEffect(() => {    
    test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    test.camera.position.set(0, 50, 500); // Better angle - slightly above and back
    test.camera.lookAt(0, 3, 0);


    let loadedModel; 
    let mixers = []; // Use separate mixers for each animation
    let actions = []; // Store all actions for debugging

    const glftLoader = new GLTFLoader();
    
    glftLoader.load('./assets/3d_origami_crane_gltf/SingleModifierFlyingCrane.glb', (gltfScene) => {
      loadedModel = gltfScene;
      const flock = spawnFlock(gltfScene.scene);
      // Set up animations with separate mixers
      if (gltfScene.animations && gltfScene.animations.length > 0) {
        
        // Create separate mixer for each animation to avoid conflicts
        gltfScene.animations.forEach((clip) => {
          
          // Create a separate mixer for this animation
          const animationMixer = new THREE.AnimationMixer(gltfScene.scene);
          const action = animationMixer.clipAction(clip);
          
          // Configure the action
          action.setLoop(THREE.LoopRepeat);
          action.play();
          
          mixers.push(animationMixer);
          actions.push(action);
        });
      }


      gltfScene.scene.rotation.y = Math.PI / 8;
      gltfScene.scene.position.y = 3;
      gltfScene.scene.scale.set(10, 10, 10);
      test.scene.add(gltfScene.scene);
    });

    
  
    const clock = new THREE.Clock();
    
    const animate = () => {
      const delta = clock.getDelta();
      
      // Update all animation mixers with proper delta time
      if (mixers.length > 0) {
        mixers.forEach(mixer => {
          mixer.update(delta);
        });
      }

      // Make the crane spin slowly
      if (loadedModel) {
        loadedModel.scene.rotation.y += 0.01; // Continuous spinning
      }

      requestAnimationFrame(animate);
    };

    function spawnFlock(number,model){
      const flock = [];
      for (let i = 0; i < number; i++){
        const boidInstance = createBoidInstanceWithAnimation(model);
        boidInstance.mesh.position.set(
          Math.random() * 200 - 100,
          Math.random() * 200 - 100,
          Math.random() * 200 - 100
        )
        flock.push(boidInstance);
      }
      return flock;
  }

  function createBoidInstanceWithAnimation(model){
    const clone = SkeletonUtils.clone(model.scene);
    const mixer = new THREE.AnimationMixer(clone);

    // Play all animations (use the original model's animations)
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat);
      action.play();
    });


    return { mesh: clone, mixer };
  }
    animate();


  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
