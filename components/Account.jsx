import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider" 
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import { useState } from "react";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
};

function Account() {
  const { authenticate, isAuthenticated, logout, user} = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();
  const [isModalVisible, setIsModalVisible] = useState(false);

 
  const avatar = user?.get('avatar'); // this is a Moralis.File that is already saved to the user object


  if (!isAuthenticated) {
    return (
      <div
        style={styles.account}
        onClick={() => authenticate({ signingMessage: "Hello World!" })}
      >
        <p style={styles.text}>Authenticate</p>
      </div>
      //You coud make it a Button with isAuthenticating like on 4:00 in https://youtu.be/FaTyOg7ickc
      //Lahko še AuthError
      
    );
  }

  return (
    <>
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: "5px", ...styles.text }}>
          {getEllipsisTxt(walletAddress, 6)}
        </p>
        
        { avatar ? (
          <img src={avatar} className="rounded-full h-11 w-11 object-contain  p-1" alt="" />
        ) : (
          <Blockie currentWallet scale={3} />
        )}
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500"}}
        width="400px"
      >
        Account
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <Address
            avatar="left"
            size={6}
            copyable
            style={{ fontSize: "20px" }}
          />
          <div style={{ marginTop: "10px", padding: "0 10px" }}>
            <a
              href={`${getExplorer(chainId)}/address/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          </div>
        </Card>
        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={() => {
            logout();
            setIsModalVisible(false);
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal>
    </>
  );
}

export default Account;
