"use client";

import { Box, Flex, Heading, Image, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IndexerClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function ClaimPage() {
  const [collectionTokens, setCollectionTokens] = useState<any[]>([]);
  const { account, signAndSubmitTransaction } = useWallet();

  const getCollectionTokens = async () => {
    if (!account) return;
    const provider = new IndexerClient(process.env.NEXT_PUBLIC_INDEXER_URL!);
    const collectionTokens = await provider.getTokenOwnedFromCollectionAddress(
      account.address,
      process.env.NEXT_PUBLIC_COLLECTION_ADDRESS!,
      { tokenStandard: "v2" }
    );
    setCollectionTokens(collectionTokens.current_token_ownerships_v2);
  };

  useEffect(() => {
    if (!account) return;
    getCollectionTokens().then((data: any) => {
      data[0] && setCollectionTokens(data[0]);
    });
  }, [account]);

  const onClaimClick = async (token_data_id: any) => {
    console.log("clicked");
    const payload: any = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::game_manager::claim`,
      type_arguments: [],
      arguments: [token_data_id],
    };
    const res = await signAndSubmitTransaction(payload);
  };

  const playerSquares = collectionTokens.map((token) => {
    return (
      <Box
        key={token}
        w={`200px`}
        h={`200px`}
        bg={"green.300"}
        borderRadius="md"
        justifyContent="center"
        alignItems="center"
        m="8px"
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <VStack>
            <Image
              mt="2"
              src={token.current_token_data.token_uri}
              className={"image-element-alive"}
            />

            {token.current_token_data.token_properties.Prize > 0 && (
              <>
                <Button
                  my="4"
                  onClick={() => onClaimClick(token.token_data_id)}
                >
                  CLAIM {token.current_token_data.token_properties.Prize} APT
                </Button>
              </>
            )}
          </VStack>
        </Box>
      </Box>
    );
  });

  return (
    <Box>
      <Heading>CLAIM</Heading>
      {collectionTokens && <Flex flexWrap="wrap">{playerSquares}</Flex>}
    </Box>
  );
}
