interface Violation {
    id: number;
    vehicle_identifier: string;
    latitude: number;
    longitude: number;
    datetime: Date;
}

export { Violation };
