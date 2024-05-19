import { MapAPI } from "~/endpoints/map";
import { makeAPI } from "./common";

export const useMapAPI = () => {
  const registerBuilding = makeAPI<MapAPI["registerBuilding"]>(
    "/api/map/building",
    "POST"
  );
  const findBuilding = makeAPI<MapAPI["findBuilding"]>(
    "/api/map/building",
    "GET"
  );
  const registerFloor = makeAPI<MapAPI["registerFloor"]>(
    "/api/map/floor",
    "POST"
  );

  const registerQRMarker = makeAPI<MapAPI["registerQRMarker"]>(
    "/api/map/qr-marker",
    "POST"
  );

  const registerNodeMarker = makeAPI<MapAPI["registerNodeMarker"]>(
    "/api/map/node-marker",
    "POST"
  );

  const combineNearNode = makeAPI<MapAPI["combineNearNode"]>(
    "/api/map/combine-node",
    "POST"
  );

  const updateMarkerName = makeAPI<MapAPI["updateMarkerName"]>(
    "/api/map/marker-name",
    "POST"
  );

  return {
    registerBuilding,
    findBuilding,
    registerFloor,
    registerQRMarker,
    registerNodeMarker,
    combineNearNode,
    updateMarkerName,
  };
};
