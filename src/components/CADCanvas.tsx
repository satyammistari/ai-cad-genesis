
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useModelContext } from "@/context/ModelContext";

interface CADCanvasProps {
  isGenerating: boolean;
}

const CADCanvas = ({ isGenerating }: CADCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const loadingRef = useRef<THREE.Mesh | null>(null);

  const { 
    modelType, 
    parameters, 
    material,
    renderQuality,
    simulationResults 
  } = useModelContext();

  // Clean up the scene before adding new objects
  const cleanupScene = () => {
    if (sceneRef.current && modelRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
  };

  // Initial setup of three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 1;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add a grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isGenerating && loadingRef.current) {
        loadingRef.current.rotation.x += 0.01;
        loadingRef.current.rotation.y += 0.01;
      }
      
      if (!isGenerating && modelRef.current) {
        modelRef.current.rotation.z += 0.002;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeChild(rendererRef.current!.domElement);
      rendererRef.current?.dispose();
    };
  }, []);

  // Update the 3D model when parameters change
  useEffect(() => {
    if (!sceneRef.current || isGenerating) return;

    cleanupScene();

    // Create loading state spinner
    if (isGenerating) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3DD2C0, 
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const cube = new THREE.Mesh(geometry, material);
      sceneRef.current.add(cube);
      loadingRef.current = cube;
      return;
    }

    // Remove the loading cube if it exists
    if (loadingRef.current && sceneRef.current) {
      sceneRef.current.remove(loadingRef.current);
      loadingRef.current = null;
    }

    // Create model based on modelType and parameters
    let model: THREE.Group;
    
    switch (modelType) {
      case 'spur-gear':
        model = createSpurGear();
        break;
      case 'flanged-coupling':
        model = createFlangedCoupling();
        break;
      case 'mounting-bracket':
        model = createMountingBracket();
        break;
      case 'heat-sink':
        model = createHeatSink();
        break;
      default:
        model = createSpurGear(); // Default to spur gear
    }

    // Apply material based on user selection
    applyMaterialToModel(model, material);
    
    // Apply simulation results visualization if available
    if (simulationResults && simulationResults.type) {
      applySimulationResults(model, simulationResults);
    }

    // Add the model to the scene
    model.rotation.x = Math.PI / 2; // Orient model flat
    sceneRef.current.add(model);
    modelRef.current = model;

  }, [modelType, parameters, material, renderQuality, isGenerating, simulationResults]);

  // Create a spur gear with customizable parameters
  const createSpurGear = () => {
    const group = new THREE.Group();
    
    // Extract parameters
    const diameter = parameters.diameter || 30;
    const faceWidth = parameters.faceWidth || 10;
    const teethCount = parameters.teeth || 20;
    const showHoles = parameters.showHoles !== undefined ? parameters.showHoles : true;
    const holeCount = parameters.holeCount || 6;
    
    // Scale factors for visual representation
    const radiusScale = diameter / 30; // Base 30mm diameter
    const heightScale = faceWidth / 10; // Base 10mm face width
    
    // Create gear body
    const gearGeometry = new THREE.CylinderGeometry(
      radiusScale, // top radius
      radiusScale, // bottom radius
      heightScale * 0.3, // height
      Math.max(24, teethCount * 2), // radial segments (higher for better quality)
      1, // height segments
      false // open ended
    );
    
    const gearMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0072CE,
      metalness: 0.5,
      roughness: 0.2
    });
    
    const gearBody = new THREE.Mesh(gearGeometry, gearMaterial);
    group.add(gearBody);
    
    // Add teeth
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      
      // Teeth size relative to overall gear size
      const toothWidth = 0.2 * radiusScale;
      const toothHeight = 0.3 * heightScale;
      const toothLength = 0.4 * radiusScale;
      
      const toothGeometry = new THREE.BoxGeometry(toothWidth, toothHeight, toothLength);
      const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
      
      tooth.position.x = Math.cos(angle) * (radiusScale * 1.2);
      tooth.position.z = Math.sin(angle) * (radiusScale * 1.2);
      tooth.rotation.y = angle;
      
      group.add(tooth);
    }
    
    // Add center hole
    const centerHoleRadius = 0.3 * radiusScale;
    const holeGeometry = new THREE.CylinderGeometry(
      centerHoleRadius, 
      centerHoleRadius, 
      heightScale * 0.4, 
      32
    );
    const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    group.add(hole);
    
    // Add mounting holes if enabled
    if (showHoles && holeCount > 0) {
      const mountingHoleRadius = 0.15 * radiusScale;
      const mountingHoleDistance = 0.7 * radiusScale;
      
      for (let i = 0; i < holeCount; i++) {
        const angle = (i / holeCount) * Math.PI * 2;
        const holeGeometry = new THREE.CylinderGeometry(
          mountingHoleRadius, 
          mountingHoleRadius, 
          heightScale * 0.4, 
          16
        );
        
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.position.x = Math.cos(angle) * mountingHoleDistance;
        hole.position.z = Math.sin(angle) * mountingHoleDistance;
        
        group.add(hole);
      }
    }
    
    return group;
  };

  // Create a flanged coupling
  const createFlangedCoupling = () => {
    const group = new THREE.Group();
    
    // Extract parameters
    const diameter = parameters.diameter || 40;
    const thickness = parameters.faceWidth || 15;
    const holeCount = parameters.holeCount || 6;
    const boltCircleDiameter = parameters.boltCircleDiameter || 30;
    
    // Scale factors
    const radiusScale = diameter / 40;
    const thicknessScale = thickness / 15;
    
    // Create flange body
    const flangeGeometry = new THREE.CylinderGeometry(
      radiusScale * 0.5 * diameter,
      radiusScale * 0.5 * diameter,
      thicknessScale * thickness,
      32
    );
    
    const flangeMaterial = new THREE.MeshStandardMaterial({
      color: 0x707070,
      metalness: 0.7,
      roughness: 0.2
    });
    
    const flange = new THREE.Mesh(flangeGeometry, flangeMaterial);
    group.add(flange);
    
    // Add central hole
    const centerHoleGeometry = new THREE.CylinderGeometry(
      radiusScale * 0.2 * diameter,
      radiusScale * 0.2 * diameter,
      thicknessScale * thickness * 1.1,
      32
    );
    
    const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
    const centerHole = new THREE.Mesh(centerHoleGeometry, holeMaterial);
    group.add(centerHole);
    
    // Add bolt holes
    if (holeCount > 0) {
      const boltCircleRadius = radiusScale * 0.5 * boltCircleDiameter;
      const boltHoleRadius = radiusScale * 0.05 * diameter;
      
      for (let i = 0; i < holeCount; i++) {
        const angle = (i / holeCount) * Math.PI * 2;
        const boltHoleGeometry = new THREE.CylinderGeometry(
          boltHoleRadius,
          boltHoleRadius,
          thicknessScale * thickness * 1.1,
          16
        );
        
        const boltHole = new THREE.Mesh(boltHoleGeometry, holeMaterial);
        boltHole.position.x = Math.cos(angle) * boltCircleRadius;
        boltHole.position.z = Math.sin(angle) * boltCircleRadius;
        
        group.add(boltHole);
      }
    }
    
    return group;
  };

  // Create a mounting bracket
  const createMountingBracket = () => {
    const group = new THREE.Group();
    
    // Extract parameters
    const width = parameters.width || 50;
    const height = parameters.height || 40;
    const thickness = parameters.thickness || 5;
    const holeCount = parameters.holeCount || 4;
    
    // Scale factors
    const widthScale = width / 50;
    const heightScale = height / 40;
    const thicknessScale = thickness / 5;
    
    // Create bracket base
    const baseGeometry = new THREE.BoxGeometry(
      widthScale * width,
      thicknessScale * thickness,
      heightScale * height
    );
    
    const bracketMaterial = new THREE.MeshStandardMaterial({
      color: 0x909090,
      metalness: 0.5,
      roughness: 0.3
    });
    
    const base = new THREE.Mesh(baseGeometry, bracketMaterial);
    group.add(base);
    
    // Add mounting holes
    if (holeCount > 0) {
      const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
      const holeRadius = thicknessScale * thickness * 0.6;
      
      // Calculate hole positions based on count
      const positions = [];
      
      if (holeCount === 1) {
        positions.push([0, 0]); // Center
      } else if (holeCount === 2) {
        positions.push([-0.3, 0], [0.3, 0]); // Two horizontally
      } else if (holeCount === 3) {
        positions.push([0, 0.3], [-0.3, -0.15], [0.3, -0.15]); // Triangle
      } else if (holeCount === 4) {
        positions.push([-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]); // Four corners
      } else {
        // Distribute holes in a circular pattern for more than 4
        for (let i = 0; i < holeCount; i++) {
          const angle = (i / holeCount) * Math.PI * 2;
          positions.push([
            Math.cos(angle) * 0.3,
            Math.sin(angle) * 0.3
          ]);
        }
      }
      
      // Create holes at calculated positions
      positions.forEach(([x, z]) => {
        const holeGeometry = new THREE.CylinderGeometry(
          holeRadius,
          holeRadius,
          thicknessScale * thickness * 1.1,
          16
        );
        
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.rotation.x = Math.PI / 2; // Orient cylinder for the hole
        hole.position.set(
          x * widthScale * width,
          0,
          z * heightScale * height
        );
        
        group.add(hole);
      });
    }
    
    return group;
  };

  // Create a heat sink
  const createHeatSink = () => {
    const group = new THREE.Group();
    
    // Extract parameters
    const baseWidth = parameters.width || 60;
    const baseLength = parameters.length || 60;
    const baseHeight = parameters.baseHeight || 5;
    const finCount = parameters.finCount || 12;
    const finHeight = parameters.finHeight || 15;
    
    // Scale factors
    const widthScale = baseWidth / 60;
    const lengthScale = baseLength / 60;
    const heightScale = baseHeight / 5;
    
    // Create base
    const baseGeometry = new THREE.BoxGeometry(
      widthScale * baseWidth,
      heightScale * baseHeight,
      lengthScale * baseLength
    );
    
    const heatSinkMaterial = new THREE.MeshStandardMaterial({
      color: 0xb0b0b0,
      metalness: 0.8,
      roughness: 0.2
    });
    
    const base = new THREE.Mesh(baseGeometry, heatSinkMaterial);
    group.add(base);
    
    // Add fins
    if (finCount > 0) {
      const finThickness = 2 * widthScale;
      const finSpacing = (baseWidth - (finCount * finThickness)) / (finCount + 1);
      const scaledFinHeight = finHeight * heightScale;
      
      for (let i = 0; i < finCount; i++) {
        const finGeometry = new THREE.BoxGeometry(
          finThickness,
          scaledFinHeight,
          lengthScale * baseLength
        );
        
        const fin = new THREE.Mesh(finGeometry, heatSinkMaterial);
        
        // Position the fin
        const xPos = -widthScale * baseWidth / 2 + (i + 1) * finSpacing + (i + 0.5) * finThickness;
        fin.position.set(
          xPos,
          (heightScale * baseHeight / 2) + (scaledFinHeight / 2),
          0
        );
        
        group.add(fin);
      }
    }
    
    return group;
  };

  // Apply material to the model based on user selection
  const applyMaterialToModel = (model: THREE.Group, materialType: string) => {
    let materialProps: {color: number, metalness: number, roughness: number};
    
    switch (materialType) {
      case 'steel':
        materialProps = { color: 0x888888, metalness: 0.8, roughness: 0.2 };
        break;
      case 'aluminum':
        materialProps = { color: 0xCCCCCC, metalness: 0.6, roughness: 0.3 };
        break;
      case 'plastic':
        materialProps = { color: 0x3377CC, metalness: 0.1, roughness: 0.8 };
        break;
      case 'titanium':
        materialProps = { color: 0x99AACC, metalness: 0.7, roughness: 0.25 };
        break;
      case 'brass':
        materialProps = { color: 0xDDBB55, metalness: 0.9, roughness: 0.15 };
        break;
      default:
        materialProps = { color: 0x888888, metalness: 0.8, roughness: 0.2 };
    }
    
    const newMaterial = new THREE.MeshStandardMaterial(materialProps);
    
    // Apply material to all meshes in the group (except holes)
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Skip holes (typically darker colored)
        if (object.material instanceof THREE.MeshStandardMaterial && 
            object.material.color.getHex() !== 0x303841) {
          object.material = newMaterial;
        }
      }
    });
  };

  // Apply simulation results visualization to the model
  const applySimulationResults = (model: THREE.Group, results: any) => {
    if (!results || !results.type) return;
    
    // Get all non-hole meshes in the model
    const meshes: THREE.Mesh[] = [];
    model.traverse((object) => {
      if (object instanceof THREE.Mesh && 
          object.material instanceof THREE.MeshStandardMaterial && 
          object.material.color.getHex() !== 0x303841) {
        meshes.push(object);
      }
    });
    
    if (meshes.length === 0) return;
    
    switch (results.type) {
      case 'stress':
        // Create a gradient from blue to red for stress visualization
        meshes.forEach(mesh => {
          const stressMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xff3300,
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.2,
          });
          mesh.material = stressMaterial;
        });
        break;
        
      case 'flow':
        // Flow visualization using a blue color gradient
        meshes.forEach(mesh => {
          const flowMaterial = new THREE.MeshStandardMaterial({
            color: 0x0066ff,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.85
          });
          mesh.material = flowMaterial;
        });
        break;
        
      case 'thermal':
        // Thermal visualization using warm colors
        meshes.forEach(mesh => {
          const thermalMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff3300,
            emissiveIntensity: 0.5,
            metalness: 0.2,
            roughness: 0.3
          });
          mesh.material = thermalMaterial;
        });
        break;
    }
  };

  return (
    <div ref={canvasRef} className="w-full h-full model-canvas bg-cad-lightGray dark:bg-cad-gray rounded-lg shadow-inner relative">
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center text-primary/70 text-lg font-medium">
          Generating 3D Model...
        </div>
      )}
    </div>
  );
};

export default CADCanvas;
