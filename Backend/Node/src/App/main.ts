import { program } from '@commander-js/extra-typings'

const cli = program
    .name('fleet')
    .description('Manage fleets of vehicles')
    .option('--backend <backend>', 'storage backend', 'memory');

cli.command('create')
    .description('create a new fleet owned by the given user and returns the new fleet\'s id.')
    .argument('<userId>', 'the owner of the fleet')
    .action((userId: string) => {
        console.log(`Creating a new fleet for user ${userId}...`);
        console.log("cli opts: ", cli.opts());

    });

cli.command('register-vehicle')
    .description('register a (new) vehicle into a fleet')
    .argument('<fleetId>', 'the id of the fleet the register the vehicle into')
    .argument('<vehiclePlateNumber>', 'the license plate (id) of the vehicle to register')
    .action((fleetId: string, vehiclePlaceNumber: string) => {
        console.log(`Registering vehicle ${vehiclePlaceNumber} into fleet ${fleetId}...`);
        console.log("cli opts: ", cli.opts());
    })

cli.command('localize-vehicle')
    .description('update a vehicle current location')
    .argument('<fleetId>', 'the id of the fleet the register the vehicle into')
    .argument('<vehiclePlateNumber>', 'the license plate (id) of the vehicle to register')
    .argument('<lon>', 'the WGS84 longitude in decimal degrees.')
    .argument('<lat>', 'the WGS84 latitude in decimal degrees.')
    .action((fleetId: string, vehiclePlaceNumber: string, lon: string, lat: string) => {
        console.log(`Moving vehicle ${vehiclePlaceNumber} from fleet ${fleetId} to lon=${lon}, lat=${lat}...`);
        console.log("cli opts: ", cli.opts());
    })

cli.parse(process.argv);