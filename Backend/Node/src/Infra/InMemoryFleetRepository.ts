import { type UserId, Fleet, type FleetId, type FleetRepository } from "../Domain/Fleet.js"

export default class InMemoryFleetRepository implements FleetRepository {
    static _nextId = 1;
    static nextId(): FleetId {
        return this._nextId++;
    }

    private fleets: Fleet[] = [];

    create(ownerId: UserId): Promise<Fleet> {
        return new Promise((resolve) => {
            const created = new Fleet(ownerId, [], InMemoryFleetRepository.nextId(), 1);
            this.fleets.push(created);
            resolve(created);
        });
    }

    save(fleet: Fleet): Promise<void> {
        return this.load(fleet.id).then((current) => {
            if (current.version != fleet.version) {
                throw new Error(`Concurrent Modification Exception: Fleet(id = ${fleet.id}, version = ${fleet.version}) is outdated.`);
            } else {
                current.version = fleet.version + 1;
                current.vehicles = fleet.vehicles;
            }
        });

    }

    load(id: FleetId): Promise<Fleet> {
        return new Promise((resolve, reject) => {
            const current = this.fleets.find((current) => current.id == id);
            if (current) {
                resolve(current);
            } else {
                reject(new Error(`Unknown Fleet(id = ${id})`));
            }
        });
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
