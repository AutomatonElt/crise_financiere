import React from "react";
import { MapRoute } from "../../components/MapRoute";

export const MapRouteSofiaAthensScene: React.FC = () => {
  return (
    <MapRoute
      mode="route"
      title="October 2017"
      subtitle="Sofia → Athens"
      waypoints={[
        { label: "SOFIA", lat: 42.6976, lon: 23.3219 },
        { label: "ATHENS", lat: 37.9838, lon: 23.7275 },
      ]}
      startFrame={15}
      focusBounds={{ latMin: 36, latMax: 44, lonMin: 20, lonMax: 27 }}
    />
  );
};

export const MapRouteWorldScene: React.FC = () => {
  return (
    <MapRoute
      mode="points"
      title="OneCoin's Global Reach"
      subtitle="175 countries — 3.5 million investors"
      pointCount={175}
      startFrame={15}
    />
  );
};

export const MapRouteSofiaCapeTownScene: React.FC = () => {
  return (
    <MapRoute
      mode="route"
      title="The Escape Route"
      subtitle="Sofia → Ionian Sea → Cape Town"
      waypoints={[
        { label: "SOFIA", lat: 42.6976, lon: 23.3219 },
        { label: "IONIAN SEA", lat: 38.0, lon: 19.0 },
        { label: "CAPE TOWN", lat: -33.9249, lon: 18.4241 },
      ]}
      startFrame={15}
      focusBounds={{ latMin: -38, latMax: 46, lonMin: 14, lonMax: 30 }}
    />
  );
};

export const MapRouteContagionScene: React.FC = () => {
  return (
    <MapRoute
      mode="route"
      title="Global Contagion"
      subtitle="Friends recruited friends across continents..."
      waypoints={[
        { label: "UGANDA", lat: 1.3733, lon: 32.2903 },
        { label: "PAKISTAN", lat: 30.3753, lon: 69.3451 },
        { label: "VIETNAM", lat: 14.0583, lon: 108.2772 },
        { label: "GERMANY", lat: 51.1657, lon: 10.4515 },
        { label: "UK", lat: 55.3781, lon: -3.4360 },
      ]}
      startFrame={15}
      zoomScale={1.5}
    />
  );
};
