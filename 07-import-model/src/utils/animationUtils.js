import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { birdStateManager } from '../birdStateManager';
export function findAnimationByName(animations, name) {
  return animations.find((clip) => clip.name === name);
}
export function getAnimationActionFromClip(mixer, animationClip) {
  return mixer.clipAction(animationClip);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function createClone(model) {
  const clonedSceneMesh = SkeletonUtils.clone(model.scene);
  clonedSceneMesh.rotation.y = Math.PI / 8;
  clonedSceneMesh.scale.set(10, 10, 10);
  const animationMixer = new THREE.AnimationMixer(clonedSceneMesh);

  return { mesh: clonedSceneMesh, mixer: animationMixer };
}
 // optional gap between papers

export function getGridPositions(center, rows, cols, paperSize = 65, gap = 0.1) {
  const positions = [];
  // Support both Vector3 and Object3D (camera, mesh, etc)
  const cx =  center.position.x;
  const cy =  center.position.y;
  const cz =  center.position.z;
  const totalWidth = cols * paperSize + (cols - 1) * gap;
  const totalHeight = rows * paperSize + (rows - 1) * gap;
  const startX = cx - totalWidth / 2 + paperSize / 2;
  const startY = cy - totalHeight / 2 + paperSize / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push(new THREE.Vector3(
        startX + c * (paperSize + gap),
        startY + r * (paperSize + gap),
        cz - 200 // keep z constant (like a wall)
      ));
    }
  }
  return positions;
}

function createDebugDot(position) {
  const geometry = new THREE.SphereGeometry(3, 32, 32); // Increased size from 5 to 20
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    depthTest: false // This ensures dots are always visible
  });
  const dot = new THREE.Mesh(geometry, material);
  dot.position.copy(position);
  dot.renderOrder = 999; // This will render the dot on top of other objects
  return dot;
}

export function formPaperGrid(camera, birds, rows, cols, scene) {
  const positions = getGridPositions(camera, rows, cols);
  
  // Create debug dots to visualize grid positions
  if(scene && !scene.userData.dotsCreated){
    positions.forEach(position => {
    const dot = createDebugDot(position);
    scene.add(dot);
  });
    scene.userData.dotsCreated = true;}
  
  // birds should be an array of bird objects to grid
  for(let i = 0; i < positions.length && i < birds.length; i++){
    const bird = birds[i];
    bird.blenderData.mesh.rotation.set(0,0,0);
    const target = positions[i];
    unfoldAction(target, bird,camera);
    
    bird.update();
    
}
}
function unfoldAction(target, bird, camera) {
    if (!target && camera) {
      target = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    }
    if (bird) {
      const distance = bird.position.distanceTo(target);
      const freezeDistance = 5; // Change this value to set how close birds stop
      if (distance > freezeDistance) {
        // Move toward target
        const direction = new THREE.Vector3().subVectors(target, bird.position).normalize();
        bird.velocity.copy(direction.multiplyScalar(0.5)); // Adjust speed as needed
      } else {
        // Snap to grid position and freeze
        if (bird.blenderData.mesh.position) {
          bird.blenderData.mesh.position.copy(target);
        }
        bird.blenderData.flappingAction.setEffectiveWeight(0);
        bird.blenderData.foldingAction.setEffectiveWeight(1);
        bird.blenderData.mesh.scale.set(20,20,20);
        bird.velocity.set(0, 0, 0);
      }
    }
    
    return bird;
}

export function foldAction(bird){
  bird.blenderData.flappingAction.setEffectiveWeight(1);
  bird.blenderData.foldingAction.setEffectiveWeight(0);

}

export function animate(birds, mixers,camera, gridStateRef,scene) {
    
    const clock = new THREE.Clock();

    function render(){
        let callOnce = false;
        const delta = clock.getDelta();
        if (mixers.length > 0) {
          mixers.forEach((mixer) => {
            mixer.update(delta);
          });
        }
          birds.forEach((surroundingBoids, boid) => {
            if (boid.state === "GRID_FORMATION") {
                const gridBirdsSet = birdStateManager.returnSubscribers();
                const gridBirds = Array.from(gridBirdsSet);
                formPaperGrid(camera, gridBirds, 2, 4, scene.scene);
              }
            else if(boid.state === "FLOCKING"){
                boid.apply_flocking_behavior(surroundingBoids);
                boid.update();
                }
            else {
                unfoldAction(null, boid, camera);
              boid.update();}
            
          });
        requestAnimationFrame(render);
    }
    render();
}
