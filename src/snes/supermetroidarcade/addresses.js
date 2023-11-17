import { rom, wram } from "../datatypes";
import MemState from "../../util/memory/MemState";

/*
    Achievement text: C6B0 - C6C7
    - 1 byte for character, 1 byte for color

    00C6BE - 248	Y
    00C6C0 - 238	O
    00C6C2 - 235	L
    00C6C4 - 238	O
    00C6C6 - 255	!
*/
export default {
    arcadeSaveBehavior: new MemState(rom.uint8Read(0xa289), "arcadeSaveBehavior", "Super Metroid Arcade Save Behavior"),
    arcadeRoomCount: new MemState(wram.uint16Read(0x1FF90), "arcadeRoomCount", "Current Arcade Room Count"),
    arcadeScore: new MemState(wram.uint32Read(0x1FFA0), "arcadeScore", "Current Arcade Score"),
    arcadeTimer: new MemState(wram.uint16Read(0x1FFEA), "arcadeTimer", "Current Arcade Timer"),
    arcadeAchievementText: new MemState(wram.dataRead(0xC6B0, 24), "arcadeAchievementText", "Current Arcade Achievement Text"),
};
