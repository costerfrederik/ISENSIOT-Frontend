interface LatestPosition {
    id: number;
    latitude: number;
    longitude: number;
    datetime: Date;
    speed: number;
}

interface MapDataPoint {
    identifier: string;
    latestPosition?: LatestPosition;
}

type MapData = MapDataPoint[];

export { LatestPosition, MapDataPoint, MapData };
