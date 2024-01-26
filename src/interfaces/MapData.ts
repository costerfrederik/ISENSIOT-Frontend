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
    trespassing: boolean;
}

export { MapDataObject, Position };
