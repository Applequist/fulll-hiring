import { Fleet, type FleetId, type FleetRepository } from "../Domain/Fleet.js"

export default class InMemoryFleetRepository implements FleetRepository {
        static _nextId = 1;
        static nextId(): FleetId {
                return this._nextId++;
        }

        private fleets: Fleet[] = [];

        save(fleet: Fleet): Promise<void> {
                return this.load(fleet.id).then((current) => {
                        if (current == undefined) {
                                // insert
                                fleet.id = InMemoryFleetRepository.nextId();
                                fleet.version = 1;
                                this.fleets.push(new Fleet(fleet.id, fleet.version, fleet.ownerId));
                        } else if (current && current.version == fleet.version) {
                                fleet.version += 1;
                                current.version = fleet.version;
                                current.vehicles = fleet.vehicles;
                        } else {
                                throw new Error("Concurrrent Modification Exception");
                        }
                });

        }

        load(fleetId: FleetId): Promise<Fleet | undefined> {
                const current = this.fleets.find((current) => current.id == fleetId);
                return Promise.resolve(current);
        }
}
