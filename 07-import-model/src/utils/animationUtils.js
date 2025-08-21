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

export function getGridPositions(center, rows, cols, separateColumn = true, paperSize = 65, gap = 0.09) {
  const mainGridPositions = [];
  const separateColumnPositions = [];
  const yOffset = 30;
  // Support both Vector3 and Object3D (camera, mesh, etc)
  const cx =  center.position.x;
  const cy =  center.position.y;
  const cz =  center.position.z;
  
  // Calculate main grid dimensions
  const totalWidth = cols * paperSize + (cols - 1) * gap;
  const totalHeight = rows * paperSize + (rows - 1) * gap;
  const startX = cx - totalWidth / 2 + paperSize / 2;
  const startY = cy - totalHeight / 2 + paperSize / 2;

  // Distance between main grid and separate column
  
  // First create the main grid positions
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      mainGridPositions.push(new THREE.Vector3(
        startX + c * (paperSize + gap),
        startY + r * (paperSize + gap) - yOffset,
        cz - 200 // keep z constant (like a wall)
      ));
    }
  }

  if (separateColumn){
    const columnOffset = totalWidth + paperSize; // 2 paper widths away from main grid

    // Add separate column positions
    const separateColumnX = startX + columnOffset;
    for (let r = 0; r < rows; r++) {
      separateColumnPositions.push(new THREE.Vector3(
        separateColumnX,
        startY + r * (paperSize + gap) - yOffset,
        cz - 200
      ));
    }
    return {mainGridPositions: mainGridPositions,
          columnPositions: separateColumnPositions
  };
  }

  return {mainGridPositions: mainGridPositions
  };
}

export function getSquareGridPositions(center, squareSize = 65, screenWidth = 1920) {
  const squares = [];
  const yOffset = 30;
  const cx = center.position.x;
  const cy = center.position.y;
  const cz = center.position.z - 200; // Same z-depth as other grid

  // Calculate horizontal spacing between squares
  const totalGaps = 3; // space between 4 squares
  const totalSquareWidth = squareSize * 4; // width of all squares
  const availableGapSpace = screenWidth - totalSquareWidth;
  const gap = availableGapSpace / totalGaps;

  // Start from the leftmost position
  const startX = cx - (screenWidth / 2) + (squareSize / 2);

  // Create 4 squares
  for (let s = 0; s < 4; s++) {
    const squareCenter = startX + (s * (squareSize + gap));
    const halfSize = squareSize / 2;

    // Create 4 vertices for each square in clockwise order from top-left
    const squareVertices = [
      new THREE.Vector3(squareCenter - halfSize, cy + halfSize - yOffset, cz),  // Top-left
      new THREE.Vector3(squareCenter + halfSize, cy + halfSize - yOffset, cz),  // Top-right
      new THREE.Vector3(squareCenter + halfSize, cy - halfSize - yOffset, cz),  // Bottom-right
      new THREE.Vector3(squareCenter - halfSize, cy - halfSize - yOffset, cz)   // Bottom-left
    ];

    squares.push(squareVertices);
  }

  return squares;
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

export function formPaperGrid(camera, birds, rows = 3, cols = 4, scene = null, viewPortState) {
  let combinedPositions = null;
  let positions = null;
  //console.log(viewPortState)
  if (viewPortState){
    console.log(viewPortState)
  switch (viewPortState) {
          case "HERO":
            // Custom logic for hero section
            const allPositions = getGridPositions(camera, rows, cols);
            //console.log(allPositions)
            positions = allPositions.mainGridPositions;
            combinedPositions = allPositions.mainGridPositions.concat(allPositions.columnPositions);
            break;
          case "ABOUT":
            positions = getGridPositions(camera, rows, cols,false).mainGridPositions;
            combinedPositions = positions; 
            break;
          case "PROJECT":
            // Custom logic for project section
            positions = getGridPositions(camera, 2, 8,false,65).mainGridPositions;
            combinedPositions = positions;
            break;
          case "SKILLS":
            // Custom logic for skills section
            positions = getGridPositions(camera, rows, cols,false).mainGridPositions;
            combinedPositions = positions; 
            break;
          case "CONTACT":
            // Custom logic for contact section
            positions = getGridPositions(camera, rows, cols,false).mainGridPositions;
            combinedPositions = positions; 
            break;
          default:
            // Fallback logic
            break;
        }}
  
  const gridDimensions = getBoundingBoxFromPositions(positions);
  // if(scene && !scene.userData.dotsCreated){
  //   createBoundingBoxDebugDots(scene,positions);
  // }
  
  // Create debug dots to visualize grid positions
  // if(scene && !scene.userData.dotsCreated){
  //   positions.forEach(position => {
  //   const dot = createDebugDot(position);
  //   scene.add(dot);
  // });
  //   scene.userData.dotsCreated = true;}
  
  // birds should be an array of bird objects to grid
  for(let i = 0; i < combinedPositions.length && i < birds.length; i++){
    const bird = birds[i];
    bird.blenderData.mesh.rotation.set(0,0,0);
    const target = combinedPositions[i];
    unfoldAction(target, bird,camera);
    bird.update();
}
  return gridDimensions;
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
        bird.velocity.copy(direction.multiplyScalar(3)); // Adjust speed as needed
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

export function animate(birds, mixers, camera, setPaperGrid, setGridDimensions, scene) {
  const clock = new THREE.Clock();

  function render() {
    const delta = clock.getDelta();

    // Update animations
    if (mixers.length > 0) {
      for (let i = 0; i < mixers.length; i++) {
        mixers[i].update(delta);
      }
    }
    const viewPortState = birdStateManager.viewPortState;
    const gridBirdsSet = birdStateManager.returnSubscribers();
    const gridBirds = gridBirdsSet ? Array.from(gridBirdsSet) : [];
    let haveArrived = [];

    if (birdStateManager.currentState === "GRID_FORMATION" && gridBirds.length > 0) {
      // Compute grid only once per frame
      const gridDimensions = formPaperGrid(camera, gridBirds, 3, 4, scene.scene, viewPortState);
      setGridDimensions(gridDimensions);

      for (let i = 0; i < gridBirds.length; i++) {
        const gridBird = gridBirds[i];
        const hasArrived = gridBird.velocity.lengthSq() === 0
        haveArrived.push(hasArrived);
      }
      if (haveArrived.every(Boolean)) {
        setPaperGrid(true);
      }
    }

    // Main loop over ALL birds (only once!)
    birds.forEach((surroundingBoids, boid) => {
      switch (boid.state) {
        case "FLOCKING":
          boid.apply_flocking_behavior(surroundingBoids);
          boid.update();
          break;

        case "GRID_FORMATION":
          // Already handled in formPaperGrid – just update
          boid.update();
          break;

        default: // IDLE, RESUME_FETCH, etc.
          unfoldAction(null, boid, camera);
          boid.update();
          break;
      }
    });

    requestAnimationFrame(render);
  }

  render();
}


/**
 * Given an array of THREE.Vector3 positions, returns the bounding box dimensions
 * and top-left origin for an SVG or canvas overlay, accounting for paper size and scale.
 * @param {THREE.Vector3[]} positions
 * @param {number} paperSize - The original paper size (default 65)
 * @param {number} scale - The scale applied to the paper mesh (default 20)
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function getBoundingBoxFromPositions(positions, paperSize = 65) {
  // positions = positions.slice(0,-3);
  // console.log(positions.length)
  if (!positions || positions.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  const halfSize = paperSize / 2; // original mesh scale is 10
  let minX = positions[0].x - halfSize, maxX = positions[0].x + halfSize;
  let minY = positions[0].y - halfSize, maxY = positions[0].y + halfSize;
  positions.forEach(pos => {
    if (pos.x - halfSize < minX) minX = pos.x - halfSize;
    if (pos.x + halfSize > maxX) maxX = pos.x + halfSize;
    if (pos.y - halfSize < minY) minY = pos.y - halfSize;
    if (pos.y + halfSize > maxY) maxY = pos.y + halfSize;
  });
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Creates debug dots at the four corners of the bounding box from positions, accounting for paper size and scale.
 * @param {THREE.Scene} scene - The scene to add the debug dots to.
 * @param {THREE.Vector3[]} positions - Array of positions (centers of papers).
 * @param {number} paperSize - The original paper size (default 65)
 * @param {number} scale - The scale applied to the paper mesh (default 20)
 */
export function createBoundingBoxDebugDots(scene, positions, paperSize = 65, scale = 20) {
  const bbox = getBoundingBoxFromPositions(positions, paperSize, scale);
  // Four corners
  const z = positions[0].z;
  const corners = [
    new THREE.Vector3(bbox.x, bbox.y, z), // top-left
    new THREE.Vector3(bbox.x + bbox.width, bbox.y, z), // top-right
    new THREE.Vector3(bbox.x, bbox.y + bbox.height, z), // bottom-left
    new THREE.Vector3(bbox.x + bbox.width, bbox.y + bbox.height, z) // bottom-right
  ];
  corners.forEach(corner => {
    const dot = createDebugDot(corner);
    scene.add(dot);
  });
}
