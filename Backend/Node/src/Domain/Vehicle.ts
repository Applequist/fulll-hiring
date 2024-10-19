import Location from "./Location.js";

export default class Vehicle {
  readonly id: string; // license plate
  location: Location;

  constructor(id: string, location = new Location({ lon: 0, lat: 0 })) {
    this.id = id;
    this.location = location;
  }

  parkAt(location: Location): boolean {
    const move_there = !this.location.equals(location);
    if (move_there) {
      this.location = location;
    }
    return move_there;
  }

}

