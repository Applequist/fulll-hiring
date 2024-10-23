import { type UserId, Fleet, type FleetId, type FleetRepository } from "../Domain/Fleet.js"

export default class InMemoryFleetRepository implements FleetRepository {
        static _nextId = 1;
        static nextId(): FleetId {
                return this._nextId++;
        }

        private fleets: Fleet[] = [];

    create(ownerId: UserId): Promise<Fleet> {
        const created = new Fleet(ownerId, [], InMemoryFleetRepository.nextId(), 1);
        this.fleets.push(created);
        return Promise.resolve(created);
    }

    save(fleet: Fleet): Promise<void> {
        return this.load(fleet.id).then((current) => {
            if (current == undefined) {
                throw new Error("Unknown fleet");
            } else if (current && current.version != fleet.version) {
                throw new Error("Concurrrent Modification Exception");
            } else {
                current.version = fleet.version + 1;
                current.vehicles = fleet.vehicles;
            }
        });

    }

    load(id: FleetId): Promise<Fleet | undefined> {
        const current = this.fleets.find((current) => current.id == id);
        return Promise.resolve(current);
    }

    delete(id: FleetId): Promise<void> {
        this.fleets = this.fleets.filter((f) => f.id != id);
        return Promise.resolve();
    }

    deleteAll(): Promise<void> {
        this.fleets = [];
        return Promise.resolve();
    }
}
