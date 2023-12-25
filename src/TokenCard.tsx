import Card from "react-bootstrap/Card";
const getImageUrl = (ipfsUrl: string) =>
  ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");

interface TokenCardProps {
  ipfsImageUrl: string;
  name: string;
  description: string;
}

function TokenCard({ ipfsImageUrl, name, description }: TokenCardProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={getImageUrl(ipfsImageUrl)}
        width={100}
        height={200}
      />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text style={{ fontSize: "16px" }}>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TokenCard;
