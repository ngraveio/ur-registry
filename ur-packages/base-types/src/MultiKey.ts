// import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";
// import { ECKey } from './ECKey';
// import { HDKey } from './HDKey';
// // Q: this thing doesn't exist on https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md
// export class MultiKey extends registryItemFactory({
//   tag: 123321123321, // Assuming a new CBOR tag for MultiKey 
//   URType: "multikey", // Assuming a new UR Type for MultiKey
//   keyMap: {
//     threshold: 1,
//     keys: 2,
//   },
//   CDDL: `
//       multikey = #6.123321123321({
//           threshold: uint,
//           keys: [+ (eckey / hdkey)]
//       })
  
//       threshold = 1
//       keys = 2
//   `,
// }) {
//   constructor(
//     threshold: number,
//     keys: (ECKey | HDKey)[],
//   ) {
//     // Pass a data object
//     super({ threshold, keys });
//   }

//   public getThreshold = () => this.data.threshold;
//   public getKeys = () => this.data.keys;

//   override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
//     const errors: Error[] = [];

//     if (typeof input.threshold !== "number") {
//       errors.push(new Error("threshold must be a number"));
//     }
//     if (!Array.isArray(input.keys)) {
//       errors.push(new Error("keys must be an array"));
//     }

//     return {
//       valid: errors.length === 0,
//       reasons: errors.length > 0 ? errors : undefined,
//     };
//   }

//   /**
//    * We need to override this method because class expects multiple arguments instead of an object
//    */
//   static override fromCBORData(val: any, allowKeysNotInMap?: boolean, tagged?: any) {
//     // Do some post processing data coming from the cbor decoder
//     const data = this.postCBOR(val, allowKeysNotInMap);

//     // Return an instance of the generated class
//     return new this(data.threshold, data.keys);
//   }
// }

// // Save to the registry
// UrRegistry.addItem(MultiKey);