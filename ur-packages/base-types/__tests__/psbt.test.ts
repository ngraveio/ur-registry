import { Ur } from "@ngraveio/bc-ur";
import { PSBT } from "../src/index";

describe("PSBT", () => {
  const psbtBytes = "70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000";
  const cborEncoded = "58a770736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000"
  const expectedUR = "ur:psbt/hdosjojkidjyzmadaenyaoaeaeaeaohdvsknclrejnpebncnrnmnjojofejzeojlkerdonspkpkkdkykfelokgprpyutkpaeaeaeaeaezmzmzmzmlslgaaditiwpihbkispkfgrkbdaslewdfycprtjsprsgksecdratkkhktikewdcaadaeaeaeaezmzmzmzmaojopkwtayaeaeaeaecmaebbtphhdnjstiambdassoloimwmlyhygdnlcatnbggtaevyykahaeaeaeaecmaebbaeplptoevwwtyakoonlourgofgvsjydpcaltaemyaeaeaeaeaeaeaeaeaebkgdcarh"

  it("should just encode bytes into hex format", () => {
    // Create new PSBT object
    const psbt = new PSBT(Buffer.from(psbtBytes, 'hex'));

    // Expect it to be a PSBT object
    expect(psbt instanceof PSBT).toBe(true);
    expect(psbt.type.URType).toBe('psbt');
    expect(psbt.type.tag).toBe(NaN);

    // Convert to UR
    const ur = psbt.toUr();
    expect(ur.toString()).toBe(expectedUR);

    // Check CBOR
    expect(ur.getPayloadHex()).toBe(cborEncoded);
  });

  it("should decode UR into PSBT object", () => {
    // Create UR object
    const ur = Ur.fromString(expectedUR);

    // Decode UR object
    const psbt = ur.decode() as PSBT;

    // Expect it to be a PSBT object
    expect(psbt instanceof PSBT).toBe(true);
    expect(psbt.type.URType).toBe('psbt');
    expect(psbt.type.tag).toBe(NaN);

    expect(Buffer.from(psbt.getPSBT()).toString('hex')).toBe(psbtBytes);
  });

});