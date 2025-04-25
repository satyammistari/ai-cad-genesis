import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useModelContext } from "@/context/ModelContext";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [zoomLevel, setZoomLevel] = useState<number>(5);

  const { 
    modelType, 
    parameters, 
    material,
    renderQuality,
    simulationResults,
    getParameterValue,
    isGenerating: contextIsGenerating,
  } = useModelContext();

  const effectiveIsGenerating = isGenerating || contextIsGenerating;

  const cleanupScene = () => {
    if (sceneRef.current && modelRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current && zoomLevel > 2) {
      setZoomLevel(prev => Math.max(2, prev - 1));
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current && zoomLevel < 10) {
      setZoomLevel(prev => Math.min(10, prev + 1));
    }
  };

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevel;
    }
  }, [zoomLevel]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoomLevel;
    camera.position.y = 1;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelRef.current) return;
      
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      modelRef.current.rotation.y += deltaMove.x * 0.01;
      modelRef.current.rotation.x += deltaMove.y * 0.01;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (effectiveIsGenerating && loadingRef.current) {
        loadingRef.current.rotation.x += 0.01;
        loadingRef.current.rotation.y += 0.01;
      }
      
      if (!effectiveIsGenerating && modelRef.current) {
        modelRef.current.rotation.z += 0.002;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      canvasRef.current?.removeChild(rendererRef.current!.domElement);
      rendererRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || effectiveIsGenerating) return;

    cleanupScene();

    if (effectiveIsGenerating) {
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

    if (loadingRef.current && sceneRef.current) {
      sceneRef.current.remove(loadingRef.current);
      loadingRef.current = null;
    }

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
      case 'gearbox-assembly':
        model = createGearboxAssembly();
        break;
      default:
        model = createSpurGear(); // Default to spur gear
    }

    applyMaterialToModel(model, material);
    
    if (simulationResults && simulationResults.type) {
      applySimulationResults(model, simulationResults);
    }

    model.rotation.x = Math.PI / 2;
    sceneRef.current.add(model);
    modelRef.current = model;
  }, [modelType, parameters, material, renderQuality, effectiveIsGenerating, simulationResults]);

  const createSpurGear = () => {
    const group = new THREE.Group();
    
    const diameter = getParameterValue('diameter') as number;
    const faceWidth = getParameterValue('faceWidth') as number;
    const teethCount = getParameterValue('teeth') as number;
    const showHoles = getParameterValue('showHoles') as boolean;
    const holeCount = getParameterValue('holeCount') as number;
    
    const radiusScale = diameter / 30;
    const heightScale = faceWidth / 10;
    
    const gearGeometry = new THREE.CylinderGeometry(
      radiusScale,
      radiusScale,
      heightScale * 0.3,
      Math.max(24, teethCount * 2),
      1,
      false
    );
    
    const gearMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0072CE,
      metalness: 0.5,
      roughness: 0.2
    });
    
    const gearBody = new THREE.Mesh(gearGeometry, gearMaterial);
    group.add(gearBody);
    
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      
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

  const createFlangedCoupling = () => {
    const group = new THREE.Group();
    
    const diameter = getParameterValue('diameter') as number;
    const thickness = getParameterValue('faceWidth') as number;
    const holeCount = getParameterValue('holeCount') as number;
    const boltCircleDiameter = getParameterValue('boltCircleDiameter') as number;
    
    const radiusScale = diameter / 40;
    const thicknessScale = thickness / 15;
    
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
    
    const centerHoleGeometry = new THREE.CylinderGeometry(
      radiusScale * 0.2 * diameter,
      radiusScale * 0.2 * diameter,
      thicknessScale * thickness * 1.1,
      32
    );
    
    const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
    const centerHole = new THREE.Mesh(centerHoleGeometry, holeMaterial);
    group.add(centerHole);
    
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

  const createMountingBracket = () => {
    const group = new THREE.Group();
    
    const width = getParameterValue('width') as number;
    const height = getParameterValue('height') as number;
    const thickness = getParameterValue('thickness') as number;
    const holeCount = getParameterValue('holeCount') as number;
    
    const widthScale = width / 50;
    const heightScale = height / 40;
    const thicknessScale = thickness / 5;
    
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
    
    if (holeCount > 0) {
      const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
      const holeRadius = thicknessScale * thickness * 0.6;
      
      const positions = [];
      
      if (holeCount === 1) {
        positions.push([0, 0]);
      } else if (holeCount === 2) {
        positions.push([-0.3, 0], [0.3, 0]);
      } else if (holeCount === 3) {
        positions.push([0, 0.3], [-0.3, -0.15], [0.3, -0.15]);
      } else if (holeCount === 4) {
        positions.push([-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]);
      } else {
        for (let i = 0; i < holeCount; i++) {
          const angle = (i / holeCount) * Math.PI * 2;
          positions.push([
            Math.cos(angle) * 0.3,
            Math.sin(angle) * 0.3
          ]);
        }
      }
      
      positions.forEach(([x, z]) => {
        const holeGeometry = new THREE.CylinderGeometry(
          holeRadius,
          holeRadius,
          thicknessScale * thickness * 1.1,
          16
        );
        
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.rotation.x = Math.PI / 2;
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

  const createHeatSink = () => {
    const group = new THREE.Group();
    
    const baseWidth = getParameterValue('width') as number;
    const baseLength = getParameterValue('length') as number;
    const baseHeight = getParameterValue('baseHeight') as number;
    const finCount = getParameterValue('finCount') as number;
    const finHeight = getParameterValue('finHeight') as number;
    
    const widthScale = baseWidth / 60;
    const lengthScale = baseLength / 60;
    const heightScale = baseHeight / 5;
    
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

  const createGearboxAssembly = () => {
    const group = new THREE.Group();
    
    const teethCount = getParameterValue('teeth') as number;
    const diameter = getParameterValue('diameter') as number;
    
    const baseGeometry = new THREE.BoxGeometry(diameter * 3, diameter * 0.2, diameter * 2);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x909090 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -diameter * 0.6;
    group.add(base);
    
    const gear1 = createGear(diameter, teethCount, diameter * 0.2);
    gear1.position.set(-diameter, 0, 0);
    group.add(gear1);
    
    const gear2 = createGear(diameter * 1.5, Math.round(teethCount * 1.5), diameter * 0.2);
    gear2.position.set(diameter * 0.75, 0, 0);
    group.add(gear2);
    
    const shaft1Geometry = new THREE.CylinderGeometry(diameter * 0.1, diameter * 0.1, diameter * 1.5, 16);
    const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x606060 });
    const shaft1 = new THREE.Mesh(shaft1Geometry, shaftMaterial);
    shaft1.rotation.x = Math.PI / 2;
    shaft1.position.set(-diameter, -diameter * 0.3, 0);
    group.add(shaft1);
    
    const shaft2Geometry = new THREE.CylinderGeometry(diameter * 0.15, diameter * 0.15, diameter * 1.5, 16);
    const shaft2 = new THREE.Mesh(shaft2Geometry, shaftMaterial);
    shaft2.rotation.x = Math.PI / 2;
    shaft2.position.set(diameter * 0.75, -diameter * 0.3, 0);
    group.add(shaft2);
    
    return group;
  };

  const createGear = (diameter: number, teethCount: number, thickness: number) => {
    const gearGroup = new THREE.Group();
    
    const bodyGeometry = new THREE.CylinderGeometry(
      diameter / 2,
      diameter / 2,
      thickness,
      Math.max(24, teethCount * 2)
    );
    
    const gearMaterial = new THREE.MeshStandardMaterial({
      color: 0x0072CE,
      metalness: 0.5,
      roughness: 0.2
    });
    
    const gearBody = new THREE.Mesh(bodyGeometry, gearMaterial);
    gearGroup.add(gearBody);
    
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      
      const toothWidth = 0.1 * diameter;
      const toothHeight = thickness * 1.2;
      const toothLength = 0.2 * diameter;
      
      const toothGeometry = new THREE.BoxGeometry(toothWidth, toothHeight, toothLength);
      const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
      
      tooth.position.x = Math.cos(angle) * (diameter / 2 * 1.2);
      tooth.position.z = Math.sin(angle) * (diameter / 2 * 1.2);
      tooth.rotation.y = angle;
      
      gearGroup.add(tooth);
    }
    
    const holeGeometry = new THREE.CylinderGeometry(
      diameter * 0.15,
      diameter * 0.15,
      thickness * 1.2,
      16
    );
    const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    gearGroup.add(hole);
    
    return gearGroup;
  };

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
    
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.material instanceof THREE.MeshStandardMaterial && 
            object.material.color.getHex() !== 0x303841) {
          object.material = newMaterial;
        }
      }
    });
  };

  const applySimulationResults = (model: THREE.Group, results: any) => {
    if (!results || !results.type) return;
    
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
    <div className="relative w-full h-full">
      <div ref={canvasRef} className="w-full h-full model-canvas bg-cad-lightGray dark:bg-cad-gray rounded-lg shadow-inner relative">
        {effectiveIsGenerating && (
          <div className="absolute inset-0 flex items-center justify-center text-primary/70 text-lg font-medium">
            Generating 3D Model...
          </div>
        )}
      </div>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handleZoomIn}
          className="bg-white/80 dark:bg-gray-800/80"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleZoomOut}
          className="bg-white/80 dark:bg-gray-800/80"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 text-xs bg-white/70 dark:bg-gray-800/70 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300">
        Drag to rotate | Use buttons to zoom
      </div>
    </div>
  );
};

export default CADCanvas;
