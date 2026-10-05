export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocalityCoordInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  addressSnippet: string;
}

export const CHARLA_LOCALITIES: Record<string, LocalityCoordInfo> = {
  "kumaraswamy-layout": {
    id: "kumaraswamy-layout",
    name: "Kumaraswamy Layout",
    lat: 12.9056,
    lng: 77.5612,
    addressSnippet: "1st Stage · 4 min to Dayananda Sagar University (DSU)"
  },
  "uttarahalli": {
    id: "uttarahalli",
    name: "Uttarahalli",
    lat: 12.9022,
    lng: 77.5385,
    addressSnippet: "Uttarahalli Main Rd · 8 min to Kumaran's School"
  },
  "banashankari": {
    id: "banashankari",
    name: "Banashankari",
    lat: 12.9255,
    lng: 77.5468,
    addressSnippet: "2nd Stage · 3 min walk to Banashankari Metro"
  },
  "padmanabhanagar": {
    id: "padmanabhanagar",
    name: "Padmanabhanagar",
    lat: 12.9180,
    lng: 77.5580,
    addressSnippet: "Near Brigade Millennium · 12 min to JP Nagar"
  },
  "jp-nagar": {
    id: "jp-nagar",
    name: "JP Nagar",
    lat: 12.9077,
    lng: 77.5855,
    addressSnippet: "5th Phase · 6 min to JP Nagar Metro & Central Mall"
  },
  "jayanagar": {
    id: "jayanagar",
    name: "Jayanagar",
    lat: 12.9308,
    lng: 77.5838,
    addressSnippet: "4th Block · 7 min to Jayanagar Metro Station"
  }
};

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Finds the closest Charla locality given user's latitude and longitude
 */
export function findNearestLocality(userLat: number, userLng: number): {
  id: string;
  name: string;
  distanceKm: number;
} {
  let closestId = "kumaraswamy-layout";
  let minDistance = Infinity;

  Object.entries(CHARLA_LOCALITIES).forEach(([id, loc]) => {
    const dist = calculateDistanceKm(userLat, userLng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestId = id;
    }
  });

  return {
    id: closestId,
    name: CHARLA_LOCALITIES[closestId].name,
    distanceKm: minDistance
  };
}
