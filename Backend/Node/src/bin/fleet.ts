import { program } from '@commander-js/extra-typings'
import { createFleet, localizeVehicle, registerVehicle, unregisterVehicle } from '../App/Command.js'
import { configure, Persistence, POSTGRES } from '../Infra/Persistence.js';
import { FleetId } from '../Domain/Fleet.js';

const persistence: Persistence = configure(POSTGRES);

const cli = program
    .name('fleet')
    .description('Manage fleets of vehicles');

cli.command('create')
    .description('create a new fleet owned by the given user and returns the new fleet\'s id.')
    .argument('<userId>', 'the owner of the fleet')
    .action(async (userId: string) => {
        try {
            const fleet = await createFleet(persistence, userId);
            console.log(fleet.id);
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message);
            } else {
                console.log("Ooops... Something bad happened, please contact support.");
            }
        } finally {
            persistence.close()
        }
    });

cli.command('register-vehicle')
    .description('register a (new) vehicle into a fleet')
    .argument('<number>', 'the id of the fleet to register the vehicle into')
    .argument('<string>', 'the license plate (id) of the vehicle to register')
    .action(async (fleetId: string, vehiclePlaceNumber: string) => {
        try {
            const fid: FleetId = parseInt(fleetId);
            const fleet = await registerVehicle(persistence, fid, vehiclePlaceNumber);
            console.log(`Fleet: ${fid}`);
            console.log("------------------------------------");
            for (const v of fleet.vehicles.entries()) {
                console.log(`${v[0]}: ${v[1]}`);
            }
        } catch (e) {
            console.log(e);
        } finally {
            persistence.close()
        }
    })


cli.command('unregister-vehicle')
    .description('unregister a  vehicle from a fleet')
    .argument('<number>', 'the id of the fleet to unregister the vehicle from')
    .argument('<string>', 'the license plate (id) of the vehicle to unregister')
    .action(async (fleetId: string, vehiclePlaceNumber: string) => {
        try {
            const fid: FleetId = parseInt(fleetId);
            const fleet = await unregisterVehicle(persistence, fid, vehiclePlaceNumber);
            console.log(`Fleet: ${fid}`);
            console.log("------------------------------------");
            for (const v of fleet.vehicles.entries()) {
                console.log(`${v[0]}: ${v[1]}`);
            }
        } catch (e) {
            console.log(e);
        } finally {
            persistence.close()
        }
    })

cli.command('localize-vehicle')
    .description('update a vehicle current location')
    .argument('<fleetId>', 'the id of the fleet the register the vehicle into')
    .argument('<vehiclePlateNumber>', 'the license plate (id) of the vehicle to register')
    .argument('<lon>', 'the WGS84 longitude in decimal degrees.')
    .argument('<lat>', 'the WGS84 latitude in decimal degrees.')
    .action(async (fleetId: string, vehiclePlaceNumber: string, lon: string, lat: string) => {
        try {
            const fid = parseInt(fleetId);
            const longitude = parseFloat(lon);
            const latitude = parseFloat(lat);
            const v = await localizeVehicle(persistence, fid, vehiclePlaceNumber, longitude, latitude);
            console.log(`Vehicle(id = ${v.id}): lon = ${longitude} lat = ${latitude}`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message);
            } else {
                console.log("An error occured: ", e);
            }
        } finally {
            persistence.close()
        }
    })

cli.parseAsync(process.argv);
