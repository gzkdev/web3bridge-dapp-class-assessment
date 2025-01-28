import { useState } from "react";
import abi from "./abi/assessment.json";
import * as ethers from "ethers";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const contractAddress = "0x524538eaf41e8a92a444d14e11de64a08131505a";

function App() {
  const [view, setView] = useState("deposit"); // deposit | withdraw
  const [amount, setAmount] = useState(0);
  const [isPendingTx, setIsPendingTx] = useState(false);

  const requestAccounts = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const deposit = async () => {
    if (typeof window.ethereum == "undefined") return;

    setIsPendingTx(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contract.deposit(amount);
      await tx.wait();
      console.log("You have deposited", amount, "succesfully");
    } catch (error) {
      toast.error("deposit failed");
    }
  };

  const withdraw = async () => {
    if (typeof window.ethereum == "undefined") return;

    setIsPendingTx(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const tx = await contract.withdraw(amount);
      await tx.wait();
      toast.success("You have withdrawn", amount, "succesfully");
    } catch {
      toast.error("withdrawal failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (view === "deposit") {
        return await deposit();
      } else if (view === "withdraw") {
        return await withdraw();
      } else {
        throw new Error("Action can either be withdraw or deposit");
      }
    } catch (e) {
      return e;
    } finally {
      // setAmount(0);
      setIsPendingTx(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        await requestAccounts();
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center border">
      <Toaster position="bottom-left" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center"
      >
        {/* Tabs */}
        <div className="flex items-center p-0.5 w-[240px] outline [&>button]:grow [&>button]:px-6 [&>button]:py-2 rounded divide-x">
          <button onClick={() => setView("deposit")}>Deposit</button>
          <button onClick={() => setView("withdraw")}>Withdraw</button>
        </div>

        {/* Input */}
        <input
          className="outline h-10 rounded w-[240px] px-3"
          type="number"
          name="amount"
          id="amount"
          inputMode="decimal"
          value={amount <= 0 ? "" : amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {/* Submit */}
        <button
          className="capitalize bg-blue-500 py-2 px-6 rounded outline-none border-none text-white font-semibold"
          type="submit"
          disabled={isPendingTx}
        >
          {isPendingTx ? "Processing..." : view}
        </button>
      </form>
    </div>
  );
}

export default App;
