import { Text, MenuItem, MenuList } from "@chakra-ui/react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";

type WalletMenuProps = {
  onMenuClose: () => void;
  onNavigate: () => void;
};

export default function WalletMenu({
  onMenuClose,
  onNavigate,
}: WalletMenuProps): JSX.Element {
  const { disconnect } = useWallet();

  const onAccountOptionClicked = () => {
    onNavigate && onNavigate();
    onMenuClose();
  };

  const handleLogout = () => {
    disconnect();
    onMenuClose();
  };

  return (
    <MenuList backgroundColor={"gray.600"}>
      <MenuItem onClick={onAccountOptionClicked} backgroundColor={"gray.600"}>
        <Text>Account</Text>
      </MenuItem>
      <MenuItem onClick={handleLogout} backgroundColor={"gray.600"}>
        <Text>Logout</Text>
      </MenuItem>
    </MenuList>
  );
}
