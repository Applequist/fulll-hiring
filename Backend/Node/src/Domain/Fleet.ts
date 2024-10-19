import Vehicle from "./Vehicle.js";

export default class Fleet {
  readonly id: number;
  readonly name: string;
  vehicles: Vehicle[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.vehicles = [];
  }

  hasVehicle(vehicle: Vehicle): boolean {
    return this.vehicles.some((v) => v.id == vehicle.id);
  }

  registerVehicle(vehicle: Vehicle) {
    const register_vehicle = !this.hasVehicle(vehicle);
    if (register_vehicle) {
      this.vehicles.push(vehicle);
    }
    return register_vehicle;
  }
};

