import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function TravelingSalesman() {
  const [points, setPoints] = useState([]);
  const [fullPath, setFullPath] = useState([]); // Complete TSP path
  const [animatedPath, setAnimatedPath] = useState([]); // Incremental path to animate
  const [currentIndex, setCurrentIndex] = useState(0); // Track the drawing position

  const handleCanvasClick = useCallback((event) => {
    const [x, y] = [event.point.x, event.point.y];
    const existingPointIndex = points.findIndex(
      ([px, py]) => Math.hypot(px - x, py - y) < 0.5
    );

    if (existingPointIndex >= 0) {
      setPoints(points.filter((_, i) => i !== existingPointIndex));
    } else {
      setPoints([...points, [x, y, 0]]);
    }
  }, [points]);

  useEffect(() => {
    const tspNearestNeighbor = (points) => {
      if (points.length < 2) {
        setFullPath(points);
        return;
      }

      const visited = new Set();
      let currentPoint = points[0];
      visited.add(0);
      const path = [currentPoint];

      while (visited.size < points.length) {
        let nearest = null;
        let nearestDist = Infinity;
        let nearestIndex = -1;

        points.forEach((point, i) => {
          if (!visited.has(i)) {
            const dist = new THREE.Vector3(...currentPoint).distanceTo(new THREE.Vector3(...point));
            if (dist < nearestDist) {
              nearest = point;
              nearestDist = dist;
              nearestIndex = i;
            }
          }
        });

        if (nearest) {
          visited.add(nearestIndex);
          path.push(nearest);
          currentPoint = nearest;
        }
      }

      path.push(points[0]); // Close the loop
      setFullPath(path); // Save the full path
      setAnimatedPath([]); // Reset animated path
      setCurrentIndex(0); // Reset current index for new animation
    };

    tspNearestNeighbor(points);
  }, [points]);

  useEffect(() => {
    if (currentIndex < fullPath.length - 1) {
      const timer = setTimeout(() => {
        setAnimatedPath((prevPath) => [
          ...prevPath,
          [fullPath[currentIndex], fullPath[currentIndex + 1]],
        ]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 500); // Adjust delay time as needed (500 ms in this case)
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullPath]);

  return (
    <>
      <mesh onClick={handleCanvasClick}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="lightgrey" side={THREE.DoubleSide} />
      </mesh>

      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      ))}

      {animatedPath.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="red"
          lineWidth={1}
        />
      ))}
    </>
  );
}

export default TravelingSalesman;