import { Avatar, Box, Button, Menu, MenuButton } from "@chakra-ui/react";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletMenu from "./WalletMenu";
import React from "react";
import { truncateAddress } from "../util";

type WalletButtonProps = {
  onModalOpen: () => void;
  onNavigate?: () => void;
};

export default function WalletButton({
  onModalOpen,
  onNavigate,
}: WalletButtonProps): JSX.Element {
  const { connected, account, wallet } = useWallet();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const handleClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    if (connected) {
      setMenuOpen(!menuOpen);
    } else {
      onModalOpen();
    }
  };

  const handleNavigate = () => {
    onNavigate && onNavigate();
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <Menu isOpen={menuOpen}>
      <Box>
        <MenuButton
          as={Button}
          noOfLines={1}
          mr={2}
          onClick={handleClick}
          border="1px solid #FF8CC3"
          background={"transparent"}
          textColor={"white"}
          borderRadius={0}
        >
          {connected ? (
            <>
              <Avatar src={wallet?.icon} width={6} height={6} mr={2} />
              {account?.ansName
                ? account?.ansName
                : truncateAddress(account?.address!)}
            </>
          ) : (
            "CONNECT WALLET"
          )}
        </MenuButton>
      </Box>
      <WalletMenu onMenuClose={handleMenuClose} onNavigate={handleNavigate} />
    </Menu>
  );
}
