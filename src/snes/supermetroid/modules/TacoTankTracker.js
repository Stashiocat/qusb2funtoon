import MemoryModule from '../../../util/memory/MemoryModule';
import { Rooms, SamusPose } from '../enums';
import Addresses from '../addresses';

export default class TacoTankTrackerModule extends MemoryModule {
    constructor() {
        super("tacoTankTracker", "Taco Tank Tracker", false);
        this.tooltip = "Totally Tracks Taco Tank Tries. Ask Taw_ about scripts to make this work in chat."
        this.attempts = [];
        this.prevReadTacoed = false;
        this.avoidDoubleTaco = false;
        this.attemptAligned = false;
        this.attemptCount = 0;
    }

    settingDefs = {
        rpsThreshold: {
            display: "Disable if Reads-per-second is below",
            type: 'number',
            default: 15,
        }
    }

    getMemoryReads() {
        return [
            // Is it possible to get X/SubX/Y/SubY in one read?
            Addresses.roomID,
            Addresses.samusX,
            Addresses.samusSubX,
            Addresses.samusY,
            Addresses.samusSubY,
            Addresses.collectedItems,
            Addresses.samusPose,
        ]
    }
    
    async memoryReadAvailable(memory, sendEvent, globalState) {
        if (globalState.readsPerSecond < this.settings.rpsThreshold) {
            // Cancel if we drop below the rps threshold
            return
        } 

        if (
            !this.attemptAligned &&
            memory.samusX.value === 555 &&
            memory.samusSubX.value === 0xFFFF &&
            memory.samusY.value === 699 &&
            memory.samusSubY.value === 0xFFFF &&
            !(memory.samusPose.value & 0x01)
        ) {
            // We are set up for an attempt...
            this.attemptAligned = true;
        } else if (this.attemptAligned && memory.samusPose.value === SamusPose.FACING_LEFT_SPIN_JUMP) {
            this.attemptAligned = false;
            this.attemptCount++;
        }

        if (this.prevReadTacoed) {
            // If the last read was within taco range, check to see if the bitfield changes
            // This catches errors where the read occurred JUST before bitfield changed for collected items.
            this.prevReadTacoed = false;
            this.avoidDoubleTaco = true;
            if (memory.collectedItems.prev(1)[3] !== memory.collectedItems.value[3]) {
                // GRAB
                sendEvent('tacoTank', {x: memory.samusX.prev(), subx: memory.samusSubX.prev().toString(16), y: memory.samusY.prev(), suby: memory.samusSubY.prev().toString(16), grab: true});
                this.attempts.push({x: memory.samusX.prev(), subx: memory.samusSubX.prev().toString(16), y: memory.samusY.prev(), suby: memory.samusSubY.prev().toString(16), grab: true});
            } else {
                // OSCILLATOR
                sendEvent('tacoTank', {x: memory.samusX.prev(), subx: memory.samusSubX.prev().toString(16), y: memory.samusY.prev(), suby: memory.samusSubY.prev().toString(16), grab: false});
                this.attempts.push({x: memory.samusX.prev(), subx: memory.samusSubX.prev().toString(16), y: memory.samusY.prev(), suby: memory.samusSubY.prev().toString(16), grab: false});
            }
        }

        if (this.checkTransition(memory.roomID, Rooms.BlueBrinstar.CONSTRUCTION_ZONE, Rooms.BlueBrinstar.BLUE_BRINSTAR_ENERGY_TANK_ROOM)) {
            // Reset attempt tracker on room entry
            this.attempts = [];
            this.prevReadTacoed = false;
            this.avoidDoubleTaco = false;
        }
        if (memory.roomID.value === Rooms.BlueBrinstar.BLUE_BRINSTAR_ENERGY_TANK_ROOM &&
            memory.samusX.value >= 453 &&
            memory.samusX.value <= 468
        ) {
            // Check for specific grab height
            if (memory.samusY.value === 579 && memory.samusSubY.value === 0) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else if (memory.samusX.value > 467 ||
                       (memory.samusX.value === 467 && memory.samusSubX.value >= 36864)) {
                this.avoidDoubleTaco = false;
            } else if ((memory.samusY.value === 580 && memory.samusSubY.value === 13312) ||
                       (memory.samusY.value === 580 && memory.samusSubY.value === 20480) ||
                       (memory.samusY.value === 580 && memory.samusSubY.value === 27648)) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else if (memory.samusX.value > 466 ||
                       (memory.samusX.value === 466 && memory.samusSubX.value >= 8192)) {
                this.avoidDoubleTaco = false;
            } else if ((memory.samusY.value === 581 && memory.samusSubY.value === 19456) ||
                       (memory.samusY.value === 581 && memory.samusSubY.value === 33792) ||
                       (memory.samusY.value === 581 && memory.samusSubY.value === 48128)) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else if (memory.samusX.value > 464 ||
                       (memory.samusX.value === 464 && memory.samusSubX.value >= 45056)) {
                this.avoidDoubleTaco = false;
            } else if ((memory.samusY.value === 582 && memory.samusSubY.value === 18432) ||
                       (memory.samusY.value === 582 && memory.samusSubY.value === 39936) ||
                       (memory.samusY.value === 582 && memory.samusSubY.value === 61440)) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else if (memory.samusX.value > 463 ||
                       (memory.samusX.value === 463 && memory.samusSubX.value >= 16384)) {
                this.avoidDoubleTaco = false;
            } else if ((memory.samusY.value === 583 && memory.samusSubY.value === 10240) ||
                       (memory.samusY.value === 583 && memory.samusSubY.value === 38912) ||
                       (memory.samusY.value === 584 && memory.samusSubY.value === 2048)) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else if (memory.samusX.value > 461 ||
                       (memory.samusX.value === 461 && memory.samusSubX.value >= 53248)) {
                this.avoidDoubleTaco = false;
            } else if ((memory.samusY.value === 583 && memory.samusSubY.value === 60416) ||
                       (memory.samusY.value === 584 && memory.samusSubY.value === 30720) ||
                       (memory.samusY.value === 585 && memory.samusSubY.value === 1024)) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else if (memory.samusX.value > 460 ||
                       (memory.samusX.value === 460 && memory.samusSubX.value >= 24576)) {
                this.avoidDoubleTaco = false;
            } else if ((memory.samusY.value === 584 && memory.samusSubY.value === 37888) ||
                       (memory.samusY.value === 585 && memory.samusSubY.value === 15360) ||
                       (memory.samusY.value === 585 && memory.samusSubY.value === 58368)) {
                if (!this.avoidDoubleTaco) {
                    this.prevReadTacoed = true;
                }
            } else {
                this.avoidDoubleTaco = false;
            }
            if (this.prevReadTacoed && memory.collectedItems.prev(1)[3] !== memory.collectedItems.value[3]) {
                // GRAB
                sendEvent('tacoTank', {x: memory.samusX.value, subx: memory.samusSubX.value.toString(16), y: memory.samusY.value, suby: memory.samusSubY.value.toString(16), grab: true});
                this.attempts.push({x: memory.samusX.value, subx: memory.samusSubX.value.toString(16), y: memory.samusY.value, suby: memory.samusSubY.value.toString(16), grab: true});
                this.prevReadTacoed = false;
                this.avoidDoubleTaco = true;
            }
        } else if (this.checkTransition(memory.roomID, Rooms.BlueBrinstar.BLUE_BRINSTAR_ENERGY_TANK_ROOM, [Rooms.EMPTY, Rooms.BlueBrinstar.CONSTRUCTION_ZONE])) {
            // Report attempts on room exit or reset
            sendEvent('exitTacoTank', {attempts: this.attempts, count: this.attemptCount})
            this.attempts = [];
            this.attemptCount = 0;
            this.avoidDoubleTaco = false;
        } else {
            this.avoidDoubleTaco = false;
        }
    }
}






// import MemoryModule from '../../../util/memory/MemoryModule';
// import { Rooms, SamusPose } from '../enums';
// import Addresses from '../addresses';

// export default class MoatDiveModule extends MemoryModule {
//     constructor() {
//         super("tacoTankTracker", "Taco Tank Tracker", false);
//         this.tooltip = "Totally Tracks Taco Tank Tries. Ask Taw_ about scripts to make this work in chat."
//         this.attempts = [];
//         this.prevReadTacoed = false;
//     }

//     settingDefs = {
//         rpsThreshold: {
//             display: "Disable if Reads-per-second is below",
//             type: 'number',
//             default: 15,
//         }
//     }

//     getMemoryReads() {
//         return [
//             Addresses.roomID,
//             Addresses.samusX,
//             Addresses.samusY,
//             Addresses.samusSubY,
//             Addresses.samusPose,
//             Addresses.samusXSpeed,
//             Addresses.samusYSpeed,
//             Addresses.collectedItems,
//         ]
//     }
    
//     async memoryReadAvailable(memory, sendEvent, globalState) {
//         if (globalState.readsPerSecond < this.settings.rpsThreshold) {
//             // Cancel if we drop below the rps threshold
//             return
//         }

//         if (this.prevReadTacoed) {
//             // If the last read was within taco range, check to see if the bitfield changes
//             // This catches errors where the read occurred JUST before bitfield changed for collected items.
//             this.prevReadTacoed = false;
//             if (memory.collectedItems.prev(1)[3] !== memory.collectedItems.value[3]) {
//                 // GRAB
//                 sendEvent('tacoTank', {x: memory.samusX.prev(), y: memory.samusY.prev(), grab: true});
//                 this.attempts.push({x: memory.samusX.prev(), y: memory.samusY.prev(), grab: true});
//             } else {
//                 // OSCILLATOR
//                 sendEvent('tacoTank', {x: memory.samusX.prev(), y: memory.samusY.prev(), grab: false});
//                 this.attempts.push({x: memory.samusX.prev(), y: memory.samusY.prev(), grab: false});
//             }
//         }

//         if (this.checkTransition(memory.roomID, Rooms.BlueBrinstar.CONSTRUCTION_ZONE, Rooms.BlueBrinstar.BLUE_BRINSTAR_ENERGY_TANK_ROOM)) {
//             // Reset attempt tracker on room entry
//             this.attempts = [];
//         }
//         if (
//             memory.roomID.value === Rooms.BlueBrinstar.BLUE_BRINSTAR_ENERGY_TANK_ROOM &&
//             memory.samusX.value >= 465 &&
//             memory.samusX.value <= 468 &&
//             memory.samusY.value === 579 &&
//             memory.samusSubY.value === 0 &&
//             this.checkTransition(memory.samusPose, SamusPose.FACING_LEFT_NORMAL_JUMP_AIMING_DOWN, [
//                 SamusPose.FACING_LEFT_NORMAL_JUMP_AIMING_UP_LEFT,
//                 SamusPose.FACING_LEFT_NORMAL_JUMP_AIMING_DOWN_LEFT,
//             ])
//         ) {
//             // Grab attempt detected as within range for success.
//             if (memory.collectedItems.prev(1)[3] !== memory.collectedItems.value[3]) {
//                 // GRAB
//                 sendEvent('tacoTank', {x: memory.samusX.value, y: memory.samusY.value, grab: true});
//                 this.attempts.push({x: memory.samusX.value, y: memory.samusY.value, grab: true});
//             } else {
//                 // Item pickup not confirmed yet (could be offset read) so delay one frame to confirm.
//                 this.prevReadTacoed = true;
//             }
//         } else if (this.checkTransition(memory.roomID, Rooms.BlueBrinstar.BLUE_BRINSTAR_ENERGY_TANK_ROOM, [Rooms.EMPTY, Rooms.BlueBrinstar.CONSTRUCTION_ZONE])) {
//             // Report attempts on room exit or reset
//             console.log(this.attempts);
//             sendEvent('exitTacoTank', this.attempts)
//             this.attempts = [];
//         }
//     }
// }
