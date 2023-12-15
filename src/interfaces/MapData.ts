interface Position {
    id: number;
    latitude: number;
    longitude: number;
    datetime: Date;
    speed: number;
}

interface MapDataObject {
    identifier: string;
    position?: Position;
}

type MapData = MapDataObject[];

export { Position, MapDataObject, MapData };
