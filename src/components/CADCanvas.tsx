
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface CADCanvasProps {
  isGenerating: boolean;
}

const CADCanvas = ({ isGenerating }: CADCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const gearRef = useRef<THREE.Group | null>(null);

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
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Create a simple gear shape for demo
    const createGear = () => {
      const group = new THREE.Group();
      
      // Create gear body
      const gearGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
      const gearMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0072CE,
        metalness: 0.5,
        roughness: 0.2
      });
      const gearBody = new THREE.Mesh(gearGeometry, gearMaterial);
      group.add(gearBody);
      
      // Add teeth
      const teethCount = 20;
      for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        
        const toothGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.4);
        const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
        
        tooth.position.x = Math.cos(angle) * 1.2;
        tooth.position.z = Math.sin(angle) * 1.2;
        tooth.rotation.y = angle;
        
        group.add(tooth);
      }
      
      // Add center hole
      const holeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
      const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x303841 });
      const hole = new THREE.Mesh(holeGeometry, holeMaterial);
      group.add(hole);
      
      return group;
    };

    if (!isGenerating) {
      const gear = createGear();
      gear.rotation.x = Math.PI / 2; // Orient gear flat
      scene.add(gear);
      gearRef.current = gear;
    } else {
      // Show placeholder cube while generating
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3DD2C0, 
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cubeRef.current = cube;
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isGenerating && cubeRef.current) {
        cubeRef.current.rotation.x += 0.01;
        cubeRef.current.rotation.y += 0.01;
      }
      
      if (!isGenerating && gearRef.current) {
        gearRef.current.rotation.z += 0.005;
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
  }, [isGenerating]);

  return (
    <div ref={canvasRef} className="w-full h-full model-canvas bg-cad-lightGray dark:bg-cad-gray rounded-lg shadow-inner" />
  );
};

export default CADCanvas;
