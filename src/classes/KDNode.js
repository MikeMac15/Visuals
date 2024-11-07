// class KDNode {
//     point
//     left
//     right
//     // point: number[];
//     // left?: KDNode | null;
//     // right?: KDNode | null;
  
//     constructor(point, left, right) {
//     // constructor(point: number[], left: KDNode | null = null, right: KDNode | null = null) {
//       this.point = point;
//       this.left = left;
//       this.right = right;
//     }
  
//     // Static method to build a KD-Tree from an array of points
//     static buildTreeFromPointsArray(points, depth = 0) {
//     // static buildTreeFromPointsArray(points: number[][], depth = 0): KDNode | null {
//       if (points.length === 0) {
//         return null;
//       }
  
//       const k = points[0].length;  // Number of dimensions
//       const axis = depth % k;      // Axis to split by
  
//       // Sort points and find the median
//       points.sort((a, b) => a[axis] - b[axis]);
//       const median = Math.floor(points.length / 2);
  
//       // Recursively build the tree
//       return new KDNode(
//         points[median],
//         KDNode.buildTreeFromPointsArray(points.slice(0, median), depth + 1),
//         KDNode.buildTreeFromPointsArray(points.slice(median + 1), depth + 1)
//       );
//     }
  
//     // Method to calculate the squared distance between two points
//     distanceSquared(point1, point2) {
//       return point1.reduce((sum, val, index) => sum + (val - point2[index]) ** 2, 0);
//     }
  
//     // Nearest Neighbor Search in KD-Tree
//     // nearestNeighborSearch(target: number[], depth: number = 0, best: KDNode | null = null): KDNode | null {
//     nearestNeighborSearch(transformedTangentWorld, depthtransformedTangentWorld = 0, best = null) {
//       // Base case: if the current node is null, return the best node found so far
//       if (!this) return best;
  
//       // Check if the current node is closer to the target than the best node
//       if (!best || this.distanceSquared(target, this.point) < this.distanceSquared(target, best.point)) {
//         best = this;
//       }
  
//       const k = target.length;
//       const axis = depth % k;
  
//       // Traverse the KD-Tree to find the best match
//       const nextBranch = target[axis] < this.point[axis] ? this.left : this.right;
//       const oppositeBranch = target[axis] < this.point[axis] ? this.right : this.left;
  
//       // Recursive call to traverse down the tree
//       if (nextBranch) {
//         best = nextBranch.nearestNeighborSearch(target, depth + 1, best);
//       }
  
//       // Check the opposite branch if it could contain a closer point
//       if (oppositeBranch && Math.abs(target[axis] - this.point[axis]) ** 2 < this.distanceSquared(target, best.point)) {
//         best = oppositeBranch.nearestNeighborSearch(target, depth + 1, best);
//       }
  
//       return best;
//     }
//   }
  

class KDNode {
  constructor(point, left = null, right = null) {
    this.point = point;
    this.left = left;
    this.right = right;
  }

  // Static method to build a KD-Tree from an array of points
  static buildTreeFromPointsArray(points, depth = 0) {
    if (points.length === 0) {
      return null;
    }

    const k = points[0].length;  // Number of dimensions
    const axis = depth % k;      // Axis to split by

    // Sort points and find the median
    points.sort((a, b) => a[axis] - b[axis]);
    const median = Math.floor(points.length / 2);

    // Recursively build the tree
    return new KDNode(
      points[median],
      KDNode.buildTreeFromPointsArray(points.slice(0, median), depth + 1),
      KDNode.buildTreeFromPointsArray(points.slice(median + 1), depth + 1)
    );
  }

  // Method to calculate the squared distance between two points
  distanceSquared(point1, point2) {
    return point1.reduce((sum, val, index) => sum + (val - point2[index]) ** 2, 0);
  }

  // Nearest Neighbor Search in KD-Tree
  nearestNeighborSearch(target, depth = 0, best = null) {
    // Base case: if the current node is null, return the best node found so far
    if (!this) return best;

    // Check if the current node is closer to the target than the best node
    if (!best || this.distanceSquared(target, this.point) < this.distanceSquared(target, best.point)) {
      best = this;
    }

    const k = target.length;
    const axis = depth % k;

    // Traverse the KD-Tree to find the best match
    const nextBranch = target[axis] < this.point[axis] ? this.left : this.right;
    const oppositeBranch = target[axis] < this.point[axis] ? this.right : this.left;

    // Recursive call to traverse down the tree
    if (nextBranch) {
      best = nextBranch.nearestNeighborSearch(target, depth + 1, best);
    }

    // Check the opposite branch if it could contain a closer point
    if (oppositeBranch && Math.abs(target[axis] - this.point[axis]) ** 2 < this.distanceSquared(target, best.point)) {
      best = oppositeBranch.nearestNeighborSearch(target, depth + 1, best);
    }

    return best;
  }
}

export default KDNode;