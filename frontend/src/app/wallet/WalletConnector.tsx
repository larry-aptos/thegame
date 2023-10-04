import { useState } from "react";
import WalletButton from "./WalletButton";
import WalletsModal from "./WalletModel";
import { useRouter } from "next/navigation";

type WalletConnectorProps = {
  networkSupport?: string;
};

export function WalletConnector({ networkSupport }: WalletConnectorProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleModalOpen = () => setModalOpen!(true);
  const handleClose = () => {
    setModalOpen(false);
  };
  const router = useRouter();

  const handleDefaultNavigate = () => {
    router.push("/account", { scroll: false });
  };

  return (
    <>
      <WalletButton
        onModalOpen={handleModalOpen}
        onNavigate={handleDefaultNavigate}
      />
      <WalletsModal
        handleClose={handleClose}
        modalOpen={modalOpen}
        networkSupport={networkSupport}
      />
    </>
  );
}
