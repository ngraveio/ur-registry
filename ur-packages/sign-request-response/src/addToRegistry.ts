import { UrRegistry } from '@ngraveio/bc-ur'
import { SignRequest } from './SignRequest'
import { SignResponse } from './SignResponse'

UrRegistry.addItemOnce(SignRequest)
UrRegistry.addItemOnce(SignResponse)
