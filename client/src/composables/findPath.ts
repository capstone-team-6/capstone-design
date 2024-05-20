import { Building } from "~/entities/map";

export const useFindPath = (
  building: Building,
  startNodeId: string,
  endNodeId: string
): string[] => {
  const markerArray: string[] = [];
  for (const floor of building.floors) {
    floor.QRMarker.forEach((marker) => markerArray.push(marker.markerId));
    floor.nodeMarker.forEach((marker) => markerArray.push(marker.markerId));
  }

  const distances: Map<string, number> = new Map();
  const previous: Map<string, string | null> = new Map();
  const visited: Set<string> = new Set();

  markerArray.forEach((markerId) => {
    distances.set(markerId, Infinity);
    previous.set(markerId, null);
  });

  distances.set(startNodeId, 0);

  let currentNodeId: string | null = startNodeId;

  const findMarkerPixel = (nodeId: string): { x: number; y: number } => {
    for (const floor of building.floors) {
      const QRMarker = floor.QRMarker.find(
        (marker) => marker.markerId === nodeId
      );
      if (QRMarker) return { x: QRMarker.xLocation, y: QRMarker.yLocation };

      const nodeMarker = floor.nodeMarker.find(
        (marker) => marker.markerId === nodeId
      );
      if (nodeMarker)
        return { x: nodeMarker.xLocation, y: nodeMarker.yLocation };
    }
    return { x: 0, y: 0 };
  };

  while (currentNodeId) {
    const currentPixel = findMarkerPixel(currentNodeId);
    const currentDistance = distances.get(currentNodeId)!;

    let neighbors: string[] = [];
    building.floors.some((floor) => {
      const QRMarker = floor.QRMarker.find(
        (marker) => marker.markerId === currentNodeId
      );
      if (QRMarker && QRMarker.nearNodeId.length > 0) {
        neighbors = QRMarker.nearNodeId;
        return true; // stops the loop once found
      }
      const nodeMarker = floor.nodeMarker.find(
        (marker) => marker.markerId === currentNodeId
      );
      if (nodeMarker && nodeMarker.nearNodeId.length > 0) {
        neighbors = nodeMarker.nearNodeId;
        return true; // stops the loop once found
      }
      return false;
    });

    visited.add(currentNodeId);

    for (const nearNode of neighbors) {
      if (!visited.has(nearNode)) {
        const nearPixel = findMarkerPixel(nearNode);
        const distance = Math.sqrt(
          Math.pow(currentPixel.x - nearPixel.x, 2) +
            Math.pow(currentPixel.y - nearPixel.y, 2)
        );
        const newDistance = currentDistance + distance;
        if (newDistance < (distances.get(nearNode) || Infinity)) {
          distances.set(nearNode, newDistance);
          previous.set(nearNode, currentNodeId);
        }
      }
    }

    let nextNodeId: string | null = null;
    let nextDistance = Infinity;
    distances.forEach((dist, node) => {
      if (!visited.has(node) && dist < nextDistance) {
        nextNodeId = node;
        nextDistance = dist;
      }
    });

    currentNodeId = nextNodeId;

    if (currentNodeId === endNodeId || nextNodeId === null) {
      break;
    }
  }

  let path: string[] = [];
  for (let at = endNodeId; at !== null; at = previous.get(at)!) {
    path.push(at);
  }

  path.reverse();

  return path;
};
