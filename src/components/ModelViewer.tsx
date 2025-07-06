import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Box as Box3d } from 'lucide-react';

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#cccccc" wireframe />
  </mesh>
);

const GLTFModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const Model = ({ url, fileType, file }: { url: string; fileType: string; file?: File }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fileType === 'stl' && file) {
      const loader = new STLLoader();
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            const arrayBuffer = event.target.result as ArrayBuffer;
            const parsedGeometry = loader.parse(arrayBuffer);
            setGeometry(parsedGeometry);
            setError(null);
          }
        } catch (err) {
          console.error('Error parsing STL:', err);
          setError('Failed to parse STL file');
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
        setError('Failed to read STL file');
      };

      reader.readAsArrayBuffer(file);
    } else if (fileType === 'stl' && url) {
      const loader = new STLLoader();

      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => {
          const parsedGeometry = loader.parse(data);
          setGeometry(parsedGeometry);
          setError(null);
        })
        .catch((err) => {
          console.error('Error loading STL:', err);
          setError('Failed to load STL file');
        });
    }
  }, [url, fileType, file]);

  if (fileType === 'stl') {
    if (error) return null;
    if (geometry) {
      return (
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#888888" />
        </mesh>
      );
    }
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary fallback={<LoadingFallback />}>
        <GLTFModel url={url} />
      </ErrorBoundary>
    </Suspense>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error loading 3D model:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ModelViewer = ({ file }: { file?: File }) => {
  const [modelUrl, setModelUrl] = useState<string>('');
  const [fileType, setFileType] = useState<string>('glb');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!['glb', 'gltf', 'stl'].includes(extension)) {
        setError('Unsupported file type. Please use GLB, GLTF, or STL files.');
        return;
      }

      if (extension === 'stl') {
        setModelUrl('');
        setFileType(extension);
        setError(null);
      } else {
        try {
          objectUrl = URL.createObjectURL(file);
          setModelUrl(objectUrl);
          setFileType(extension);
          setError(null);
        } catch (err) {
          console.error('Error creating object URL:', err);
          setError('Failed to load the model file');
        }
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  if (error) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Box3d className="w-12 h-12 mx-auto mb-3" />
          <p>Upload a 3D model to preview it here</p>
          <p className="text-sm mt-2">Supported formats: GLB, GLTF, STL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
        <color attach="background" args={['#f8f9fa']} />
        <Stage environment="city" intensity={0.6}>
          <Model url={modelUrl} fileType={fileType} file={file} />
        </Stage>
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
};

export default ModelViewer;