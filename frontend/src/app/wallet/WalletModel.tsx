import {
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Wallet,
  WalletName,
  WalletReadyState,
  isRedirectable,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";

const ConnectWalletRow: React.FC<{
  wallet: Wallet;
  onClick(): void;
}> = ({ wallet, onClick }) => {
  return (
    <Flex
      p={2}
      bgColor={"gray.600"}
      width={"100%"}
      borderRadius={5}
      justifyContent={"space-between"}
    >
      <Flex align="center" justify="space-around">
        <Image src={wallet.icon} width={25} height={25} alt="wallet icon" />
        <Text pl={2} fontWeight="bold">
          {wallet.name}
        </Text>
      </Flex>
      <Button
        size="md"
        mr={2}
        // bgColor="#4EB1AA"
        onClick={onClick}
        color="#FF8CC3" // Set border properties here
      >
        Connect
      </Button>
    </Flex>
  );
};

const InstallWalletRow: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  return (
    <Flex
      padding={2}
      bgColor={"gray.600"}
      width={"100%"}
      borderRadius={5}
      justifyContent={"space-between"}
    >
      <Flex align="center" justify="space-around">
        <Image src={wallet.icon} width={25} height={25} alt="wallet icon" />
        <Text sx={{ opacity: "0.5" }} pl={2} fontWeight="bold">
          {wallet.name}
        </Text>
      </Flex>
      <Link
        as="a"
        href={wallet.url}
        target="_blank"
        size="sm"
        mr={8}
        color="#4EB1AA"
        fontWeight="bold"
      >
        Install
      </Link>
    </Flex>
  );
};

type WalletsModalProps = {
  handleClose: () => void;
  modalOpen: boolean;
  networkSupport?: string;
};

export default function WalletsModal({
  handleClose,
  modalOpen,
  networkSupport,
}: WalletsModalProps): JSX.Element {
  const { wallets, connect } = useWallet();

  const onWalletSelect = (walletName: WalletName) => {
    connect(walletName);
    handleClose();
  };

  const handleModalClose = () => {
    handleClose();
  };

  const renderWalletsList = () => {
    let filteredWallets = wallets; // Initially show all wallets

    return filteredWallets.map((wallet) => {
      const hasMobileSupport = Boolean(wallet.deeplinkProvider);
      const isWalletReady =
        wallet.readyState === WalletReadyState.Installed ||
        wallet.readyState === WalletReadyState.Loadable;

      // The user is on a mobile device
      if (!isWalletReady && isRedirectable()) {
        // If the user has a deep linked app, show the wallet
        if (hasMobileSupport) {
          return (
            <ConnectWalletRow
              key={wallet.name}
              wallet={wallet}
              onClick={() => connect(wallet.name)}
            />
          );
        }

        // Otherwise don't show anything
        return null;
      }

      // The user is on a desktop device
      return (
        <Flex key={wallet.name}>
          {isWalletReady ? (
            <ConnectWalletRow
              wallet={wallet}
              onClick={() => onWalletSelect(wallet.name)}
            />
          ) : (
            <InstallWalletRow wallet={wallet} />
          )}
        </Flex>
      );
    });
  };

  return (
    <Modal isOpen={modalOpen} onClose={handleModalClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent backgroundColor={"gray"}>
        <ModalHeader>
          <Flex align="center">
            <Heading textAlign="center" size="md">
              Connect Wallet
            </Heading>
            <ModalCloseButton onClick={handleModalClose} />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            {networkSupport && (
              <Text fontSize="sm" color="gray" textAlign="center" opacity={0.6}>
                {networkSupport} only
              </Text>
            )}
            <Stack pb={4}>{renderWalletsList()}</Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
