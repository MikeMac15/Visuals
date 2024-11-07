
import './App.css';
import { Canvas } from '@react-three/fiber';
import ClosestPoint from './ThreePages/ClosestPoint';
import { Line, OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from "three";

function ContinuousLine({ pointsArray }) {
  // Convert each point array to a THREE.Vector3, which is required by the Line component
  const points = pointsArray.map((point) => new THREE.Vector3(...point));
  // Add the starting point to the end to close the loop
  if (points.length > 1) {
    points.push(points[0].clone()); // Clone to avoid modifying the original point
  }

  return (
    <Line
      points={points} // Array of points for the line to connect
      color="white"    // Line color
      lineWidth={2} 
      transparent
      opacity={0.02}   // Line width
      dashed={false}   // Set to true if you want a dashed line
    />
  );
}

function OptimizePointsArray(pointsArray) {
  const visited = new Set();
  let currentPoint = pointsArray[0];
  visited.add(0);
  const path = [currentPoint];
  let length = 0;

  for (let i = 1; i < pointsArray.length; ++i){
    console.log(i, `${pointsArray[i]}`)
  }
}


function App() {
  const [length, setLength] = useState(0);
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    console.log("rerendered");
  }, [rerender]);




  const [pointsArray, setPoints] = useState([
    [0, 0, 0],
    [1, 2, 0],
    [3, 1, 0],
    [4, 3, 0],
    [5, 0, 0]
  ]);




  return (
    <div className="App">
    <h1>Closest Point Visualizer</h1>
    <h2>Total Length: {length.toFixed(1)}</h2>
    <h3>Click to add/remove points</h3>
    <button onClick={()=>setRerender(!rerender)}>rerender</button>
    <div id="canvas-container">
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 50] }}>
        <ambientLight intensity={5} />
        <directionalLight position={[0, 0, 10]} intensity={0.7} />
        <OrbitControls enableRotate={false} enablePan={true} />
        <ClosestPoint setLength={setLength} rerender={rerender} points={pointsArray} setPoints={setPoints}/>
        <ContinuousLine pointsArray={pointsArray} />
      </Canvas>
    </div>
  </div>
  );
}

export default App;
