import { CryptoPortfolioMetadata } from "@ngraveio/bc-ur-multi-layer-sync";
import { CryptoTxSignature } from "../src";


describe('TxSignature', () => {

    it('Should prepend zeros to request id if its less than 16 bytes', () => {
        const requestId = Buffer.from('babe', 'hex');
    
        const ethSignature = new CryptoTxSignature({
            requestId,
            signature: Buffer.from('abdacaca', 'hex'),
        });
    
        expect(ethSignature.getRequestId()?.toString('hex')).toEqual('0000000000000000000000000000babe');
      });
    
      it('Should throw error if request id is more than 16 bytes', () => {
        const requestId = Buffer.from('babe'.repeat(10), 'hex');
    
        expect(() => {
          new CryptoTxSignature({
            requestId,
            signature: Buffer.from('abdacaca', 'hex'),
          });
        }).toThrowError('Request id should not be longer than 16 bytes');
      });

      it('Should encode and decode CryptoTxSignature without metadata', () => {
        const requestId = Buffer.from('babe', 'hex');
        const signature = Buffer.from('abdacaca', 'hex');

        const txSignature = new CryptoTxSignature({
            requestId,
            signature,
        });

        // Check fields
        expect(txSignature.getRequestId()?.toString('hex')).toEqual('0000000000000000000000000000babe');
        expect(txSignature.getSignature().toString('hex')).toEqual('abdacaca');
        expect(txSignature.getMetadata()).toBeUndefined();


        // Encode
        const cbor = txSignature.toCBOR().toString('hex'); // a201d825500000000000000000000000000000babe0244abdacaca

        // Decode
        const decodedTxSignature = CryptoTxSignature.fromCBOR(Buffer.from(cbor, 'hex'));

        expect(decodedTxSignature.getRequestId()?.toString('hex')).toEqual(txSignature.getRequestId()?.toString('hex'));
        expect(decodedTxSignature.getSignature().toString('hex')).toEqual(txSignature.getSignature().toString('hex'));
        expect(decodedTxSignature.getMetadata()).toStrictEqual(txSignature.getMetadata());
      });

      it('Should encode and decode CryptoTxSignature with metadata', () => {
        const requestId = Buffer.from('babe', 'hex');
        const signature = Buffer.from('abdacaca', 'hex');
        const metadata = new CryptoPortfolioMetadata({
            firmwareVersion: "1.3.1",
            device: "Ngrave",
        })

        const txSignature = new CryptoTxSignature({
            requestId,
            signature,
            metadata,
        });

        // Check fields
        expect(txSignature.getRequestId()?.toString('hex')).toEqual('0000000000000000000000000000babe');
        expect(txSignature.getSignature().toString('hex')).toEqual('abdacaca');
        expect(txSignature.getMetadata()?.getFirmwareVersion()).toEqual('1.3.1');


        // Encode
        const cbor = txSignature.toCBOR().toString('hex'); // a301d825500000000000000000000000000000babe0244abdacaca03d9057ca20365312e332e3104664e6772617665

        // Decode
        const decodedTxSignature = CryptoTxSignature.fromCBOR(Buffer.from(cbor, 'hex'));

        expect(decodedTxSignature.getRequestId()?.toString('hex')).toEqual(txSignature.getRequestId()?.toString('hex'));
        expect(decodedTxSignature.getSignature().toString('hex')).toEqual(txSignature.getSignature().toString('hex'));
        expect(decodedTxSignature.getMetadata()?.getFirmwareVersion()).toStrictEqual(txSignature.getMetadata()?.getFirmwareVersion());
        expect(decodedTxSignature.getMetadata()?.getDevice()).toStrictEqual(txSignature.getMetadata()?.getDevice());
      });      
    
});