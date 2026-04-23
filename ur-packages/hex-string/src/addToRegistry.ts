import { UrRegistry } from '@ngraveio/bc-ur'
import { HexString } from './HexString'

// Add hex-string to the global registry
UrRegistry.addItemOnce(HexString);