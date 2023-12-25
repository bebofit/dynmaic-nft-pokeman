import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import opeansea from "./assets/opensea.png";

const openOpenSeaContract = () => {
  window.open(
    "https://testnets.opensea.io/0xAC1f1cb5d10B800EEfd1DdfBd1af93A9D3202907",
    "_blank"
  );
};

interface ForgeNavProps {
  address: string;
  loadData: () => void;
  isValidNetwork: boolean;
}

function ForgeNav({ address, loadData, isValidNetwork }: ForgeNavProps) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Evolve Pokeman</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {address && isValidNetwork ? (
            <Navbar.Text>
              Signed in as: <a href="#login">{address}</a>
            </Navbar.Text>
          ) : (
            <Button variant="primary" onClick={loadData}>
              Connect to Metamask
            </Button>
          )}
          {!isValidNetwork && <span>Please switch to correct network</span>}
          <Image
            className="mx-2"
            width={100}
            src={opeansea}
            onClick={openOpenSeaContract}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ForgeNav;
