import { After, Before } from '@cucumber/cucumber';

import { configure, POSTGRES } from '../../../src/Infra/Persistence.js';


Before(function() {
    const { Vehicles, Fleets } = configure(POSTGRES);
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});

After(async function() {
    await this.Fleets.deleteAll();
    await this.Vehicles.deleteAll();
});

