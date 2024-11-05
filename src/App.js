import logo from './logo.svg';
import './App.css';
import { Canvas } from '@react-three/fiber';
import TravelingSalesman from './ThreePages/TravelingSalesman';
import { OrbitControls } from '@react-three/drei';

function App() {
  return (
    <div className="App">
    <h1>Traveling Salesman Visualizer</h1>
    <div id="canvas-container">
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 50] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 10]} intensity={0.7} />
        <OrbitControls enableRotate={false} enablePan={true} />
        <TravelingSalesman />
      </Canvas>
    </div>
  </div>
  );
}

export default App;
