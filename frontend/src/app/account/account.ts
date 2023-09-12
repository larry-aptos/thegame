import { AptosAccount, HexString } from "aptos";

export function adminAccount() {
  return new AptosAccount(
    new HexString(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!).toUint8Array(),
  );
}
