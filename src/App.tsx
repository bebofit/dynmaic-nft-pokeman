import { useCallback, useEffect, useState } from "react";
import abi from "./abi/EvolvePokeman.json";
import "./App.css";
import { ethers } from "ethers";
import NavBar from "./NavBar";
import NoWallet from "./NoWallet";
import Nft from "./Nft";
import "bootstrap/dist/css/bootstrap.min.css";

const contractAddress = "0x5C5d90eE82032bE4DEC462628C46B423AaFa3D13";

function App() {
  const [user, setUser] = useState<string>("");
  const [isValidNetwork, setNetwork] = useState(true);
  const [contract, setContract] = useState<ethers.Contract>();

  const loadData = useCallback(async () => {
    try {
      console.log(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUser(address);
      const networkId = await provider.getNetwork();
      console.log(networkId);
      if (networkId.chainId.toString() !== "80001") {
        console.log("wrong network");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
              chainName: "Mumbai",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://mumbai.polygonscan.com"],
            },
          ],
        });
        setNetwork(true);
      }
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log(contract);
      setContract(contract);
    } catch (error) {
      console.log(error);
      alert("FAILED TO CONNECT TO METAMASK");
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (networkId: string) => {
        console.log(networkId);
        if (networkId !== "0x13881") {
          setNetwork(false);
        } else {
          setNetwork(true);
        }
      });
      window.ethereum.on("accountsChanged", (accounts: unknown) => {
        console.log(accounts);
      });
    }
  }, []);

  return (
    <div className="App">
      <NavBar
        address={user}
        loadData={loadData}
        isValidNetwork={isValidNetwork}
      />
      <header className="App-header">
        {user ? <Nft contract={contract} user={user} /> : <NoWallet />}
      </header>
    </div>
  );
}

export default App;
