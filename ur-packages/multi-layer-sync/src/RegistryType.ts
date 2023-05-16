import { RegistryType } from "@keystonehq/bc-ur-registry";

export const ExtendedRegistryTypes = {
  CRYPTO_DETAILED_ACCOUNT: new RegistryType("crypto-detailed-account", 1402),
  CRYPTO_SYNC_COIN: new RegistryType("crypto-portfolio-coin", 1403),
  CRYPTO_SYNC_METADATA: new RegistryType("crypto-sync-metadata", 1404),
  CRYPTO_PORTFOLIO: new RegistryType("crypto-portfolio", 1405),
};
