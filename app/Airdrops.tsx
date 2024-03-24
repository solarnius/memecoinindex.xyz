"use client";

import { useEffect, useState } from "react";
import portfolio from "./portfolio.json";

export default function Airdrops() {
  const [solPrice, setSolPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [positions, setPositions] = useState({} as { [key: string]: number });

  async function getPositions() {
    const tokenAccounts = await fetch(
      "https://donnie-bx0ny6-fast-mainnet.helius-rpc.com/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            "A9uP1myTjrj9jNzRSLHqCeqRfrQSA8fUNiS6AFfJaZ9V",
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            {
              encoding: "jsonParsed",
            },
          ],
        }),
      }
    );
    const tokenAccountsJson = await tokenAccounts.json();

    let wallet = {} as { [key: string]: number };

    for (let i = 0; i < tokenAccountsJson.result.value.length; i++) {
      const tokenAccount = tokenAccountsJson.result.value[i];
      const balance =
        tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
      const mint = tokenAccount.account.data.parsed.info.mint;

      if (balance > 0) {
        wallet[mint] = balance;
      }
    }

    const jupiterUrl = `https://price.jup.ag/v4/price?ids=So11111111111111111111111111111111111111112,${Object.keys(
      wallet
    ).join(",")}`;

    const jupiterResponse = await fetch(jupiterUrl);
    const jupiterJson = await jupiterResponse.json();

    setSolPrice(
      jupiterJson.data["So11111111111111111111111111111111111111112"].price ?? 0
    );

    let walletBalance = 0;

    const tokens = Object.keys(jupiterJson.data).filter(
      (t) => t !== "So11111111111111111111111111111111111111112"
    );
    let values = {} as { [key: string]: number };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const balance = wallet[token];
      const price = jupiterJson.data[token].price;
      const mintSymbol = jupiterJson.data[token].mintSymbol;

      const value = balance * price;

      walletBalance += value;
      values[mintSymbol] = value;
    }

    return values;
  }

  useEffect(() => {
    getPositions().then((wallet) => {
      setPositions(wallet);
      const total = Object.values(wallet).reduce((a, b) => a + b, 0);
      setBalance(total);
    });
  }, []);

  return (
    <div className="flex flex-col items-center py-2 max-w-md mx-8 gap-4">
      <h1 className="text-xl font-bold">
        Airdrop Value:{" "}
        {balance.toLocaleString("en-US", {
          currency: "USD",
          style: "currency",
        })}
      </h1>
      <span className="text-xs">
        Airdrops were sent to A9uP1myTjrj9jNzRSLHqCeqRfrQSA8fUNiS6AFfJaZ9V
        either as advertising or donations. If you want your ticker to show up
        in this experiment, feel free to donate! Airdrops will be held until the
        end of the experiment (TBD but a few months at least).
      </span>

      <table className="text-xs">
        <tr>
          <th>Ticker</th>
          <th>Value</th>
        </tr>
        {Object.keys(positions)
          .sort((a, b) => positions[b] - positions[a])
          .map((mint) => {
            return (
              <tr key={mint}>
                <td className="px-2">{mint}</td>
                <td className="px-2">
                  {positions[mint].toLocaleString("en-US", {
                    currency: "USD",
                    style: "currency",
                  })}
                </td>
              </tr>
            );
          })}
      </table>
    </div>
  );
}
