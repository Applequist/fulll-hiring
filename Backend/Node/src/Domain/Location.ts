import assert from 'assert';

/**
 * A value class containing WGS84 longitude/latitude coordinates 
 * in decimal degrees.
 */
export default class Location {
  readonly lon: number;
  readonly lat: number;

  /**
   * Create a new location value at the given longitude and latitude coordinates 
   * given in decimal degrees.
   */
  constructor(coords: { lon: number, lat: number }) {
    this.lon = coords.lon;
    this.lat = coords.lat;
  }

  equals(other: { lon: number, lat: number }): boolean {
    return this.lon == other.lon && this.lat == other.lat;
  }

}

assert(new Location({ lon: 0, lat: 1 }).equals(new Location({ lon: 0, lat: 1 })));
assert(!new Location({ lon: 0, lat: 1 }).equals(new Location({ lon: 1, lat: 0 })));

