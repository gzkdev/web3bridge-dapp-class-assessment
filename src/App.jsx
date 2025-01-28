import { useState } from "react";
import greeterABI from "./abi/greeter.json";

const ASSESSMENT_CONTRACT = "0x524538eaf41e8a92a444d14e11de64a08131505a";

function App() {
  const [userInput, setUserInput] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <input type="text" placeholder="Set your message" />
      <button>Set Message</button>
      <button>Get Message</button>
      <p>Retrieved Message: </p>
    </div>
  );
}

export default App;
