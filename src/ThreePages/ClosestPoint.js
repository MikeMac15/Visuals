import { useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { QuadraticBezierLine, Text } from "@react-three/drei";
import * as THREE from "three";

function ClosestPoint({ setLength, rerender, points,setPoints }) {
  // const [points, setPoints] = useState([]);
  const [fullPath, setFullPath] = useState([]);
  const [animatedPath, setAnimatedPath] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dashOffsets, setDashOffsets] = useState([]); // Track dash offsets

  const handleCanvasClick = useCallback(
    (event) => {
      const [x, y] = [event.point.x, event.point.y];
      const existingPointIndex = points.findIndex(
        ([px, py]) => Math.hypot(px - x, py - y) < 0.5
      );

      if (existingPointIndex >= 0) {
        setPoints((prev) => prev.filter((_, i) => i !== existingPointIndex));
      } else {
        setPoints((prev) => [...prev, [x, y, 0]]);
      }
    },
    [points]
  );

  const tspNearestNeighbor = (points) => {
    if (points.length < 2) {
      setFullPath(points);
      return;
    }

    const visited = new Set();
    let currentPoint = points[0];
    visited.add(0);
    const path = [currentPoint];
    let length = 0;

    while (visited.size < points.length) {
      let nearestDist = Infinity;
      let nearestIndex = -1;

      points.forEach((point, i) => {
        if (!visited.has(i)) {
          const dist = new THREE.Vector3(...currentPoint).distanceTo(
            new THREE.Vector3(...point)
          );
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestIndex = i;
          }
        }
      });

      if (nearestIndex !== -1) {
        visited.add(nearestIndex);
        path.push(points[nearestIndex]);
        length += nearestDist;
        currentPoint = points[nearestIndex];
      }
    }

    length += new THREE.Vector3(...path[path.length - 1]).distanceTo(
      new THREE.Vector3(...points[0])
    );
    path.push(points[0]);

    setFullPath(path);
    setAnimatedPath([]);
    setCurrentIndex(0);
    setDashOffsets(path.map(() => 0)); // Initialize dashOffsets for each line segment
    setLength(length);
  };

  useEffect(() => {
    
    tspNearestNeighbor(points);
  }, [rerender]);

  useEffect(() => {
    if (currentIndex < fullPath.length - 1) {
      const timer = setTimeout(() => {
        setAnimatedPath((prevPath) => [
          ...prevPath,
          { start: fullPath[currentIndex], end: fullPath[currentIndex + 1] },
        ]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullPath]);

  useFrame((_, delta) => {
    // Update each dash offset to create movement
    setDashOffsets((offsets) =>
      offsets.map((offset) => offset - delta * 25) // Adjust speed by modifying the multiplier
    );
  });

  return (
    <group position={[0, 0, -1]}>
      <mesh onClick={handleCanvasClick}>
        <planeGeometry args={[100, 40]} />
        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
      </mesh>

      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={index==0 ? "gold" :"white"} />
        </mesh>
      ))}

      {animatedPath.map((line, index) => (
        <group key={index}>
          <QuadraticBezierLine
            start={line.start}
            end={line.end}
            color={index%2===0 ? "white" : "whitesmoke"}
            dashed
            
            dashSize={3}
            dashScale={50}
            gapSize={50}
            dashOffset={dashOffsets[index]} // Apply animated dash offset
          />
          <QuadraticBezierLine
            start={line.start}
            end={line.end}
            color="white"
            lineWidth={2}
            transparent
            opacity={0.1}
          />
        </group>
      ))}
    </group>
  );
}

export default ClosestPoint;
