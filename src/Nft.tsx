import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import TokenCard from "./TokenCard";

interface NFT {
  name: string;
  description: string;
  ipfsImageUrl: string;
}

interface NftProps {
  contract: ethers.Contract | undefined;
  user: string | null;
}

export default function Nft({ contract, user }: NftProps) {
  const [tokens, setTokens] = useState<Map<string, NFT>>(new Map());

  const getIPFSFromIPFSMetaData = useCallback((ipfsUrl: string) => {
    const url = ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    return fetch(url)
      .then((res) => res.json())
      .then((data) => data.image);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // should be
      const mintedTokens = await contract!.getOwnerTokens(user);
      for (let i = 0; i < mintedTokens.length; i++) {
        const url = await contract!.tokenURI(mintedTokens[i].toString());
        const imageUrl = await getIPFSFromIPFSMetaData(url);
        const token = {
          name: "Pokeman",
          description: "A dynamic NFT that evolves every minute for 3 stages",
          ipfsImageUrl: imageUrl,
        };
        setTokens((prev) =>
          new Map(prev).set(mintedTokens[i].toString(), token)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [contract, getIPFSFromIPFSMetaData, user]);

  const mint = useCallback(async () => {
    try {
      if (contract !== null && user !== null) {
        const trx = await contract!.safeMint(user);
        await trx.wait();
        console.log(trx);
        await fetchData();
      }
    } catch (error) {
      console.log(error);
      alert("error while minting please try again");
    }
  }, [contract, user, fetchData]);

  useEffect(() => {
    if (contract != null && user != null) {
      // eslint-disable-next-line no-inner-declarations
      fetchData();
    }
  }, [contract, fetchData, user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId); //This is important
  }, [fetchData]);

  return (
    <Container>
      <h1>Pokeman Evolution</h1>
      {tokens.size ? (
        <Stack direction="horizontal" gap={3} className="flex-wrap">
          {Array.from(tokens.values()).map((token, index) => (
            <TokenCard
              key={index}
              name={token.name}
              description={token.description}
              ipfsImageUrl={token.ipfsImageUrl}
            />
          ))}
        </Stack>
      ) : (
        <h3>"No Tokens Minted Yet, Mint one now! \n it is free!"</h3>
      )}

      <Button onClick={mint} variant="primary" style={{ fontSize: 20 }}>
        Mint
      </Button>
    </Container>
  );
}
