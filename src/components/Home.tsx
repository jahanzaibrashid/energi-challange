import { useEffect, useState } from "react";
import Loading from "../assets/amalie-steiness.gif";

interface IToken {
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export default function Home() {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function fetchData() {
    setLoading(true);
    const resp = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=10');
    const data = await resp.json();
    setTokens(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="mx-auto max-w-2xl py-8">
      {isLoading && <img src={Loading} alt="loading" className="w-20 mx-auto mt-20" />}
      {!isLoading && <table className="table-auto w-full border-collapse text-center border border-slate-300 dark:border-slate-800">
        <thead>
          <tr>
            <th scope="col" className="px-5 py-3 border-b border-slate-300 dark:border-slate-800">#</th>
            <th scope="col" className="px-5 py-3 border-b border-slate-300 dark:border-slate-800 text-left">Coin</th>
            <th scope="col" className="px-5 py-3 border-b border-slate-300 dark:border-slate-800"></th>
            <th scope="col" className="px-5 py-3 border-b border-slate-300 dark:border-slate-800">Price</th>
          </tr>
        </thead>
        <tbody className="">
          {tokens.map(({image, name, symbol, current_price}: IToken, index) => (
            <tr key={index}>
              <td className="px-5 py-3 border-b border-slate-300 dark:border-slate-800">{index + 1}</td>
              <td className="px-5 py-3 border-b border-slate-300 dark:border-slate-800 items-end font-bold">
                <div className="flex">
                  <img src={image} alt={`token image ${symbol}`} className="w-6 mr-3" />
                  {name}
                </div>
              </td>
              <td className="text-center border-b border-slate-300 dark:border-slate-800 uppercase px-6 py-4 whitespace-nowrap">{symbol}</td>
              <td className="text-center border-b border-slate-300 dark:border-slate-800 px-6 py-4 whitespace-nowrap">{current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
}