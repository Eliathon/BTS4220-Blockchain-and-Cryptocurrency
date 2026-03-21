import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import TodoListABI from "../TodoListABI.json";

const CONTRACT_ADDRESS = "0x9cA516eCb4bFE2f96d058bD6F88023060205208d";

function formatTimestamp(ts) {
  const num = Number(ts);
  if (!num) return "Ikke fullført";
  return new Date(num * 1000).toLocaleString();
}

function normalizeTasks(raw) {
  return raw.map((t) => ({
    id: Number(t.id),
    description: t.description,
    createdAt: Number(t.createdAt),
    completedAt: Number(t.completedAt),
    user: t.user,
    isPrivate: Boolean(t.isPrivate),
    completed: Boolean(t.completed),
  }));
}

export default function TodoApp() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [status, setStatus] = useState("");

  const connect = async () => {
    try {
      setStatus("");

      if (!window.ethereum) {
        setStatus("MetaMask ble ikke funnet.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);

      const todoContract = new Contract(CONTRACT_ADDRESS, TodoListABI, signer);
      setContract(todoContract);

      const rawTasks = await todoContract.getMyTasks();
      setTasks(normalizeTasks(rawTasks));

      setStatus("Tilkoblet MetaMask.");
    } catch (error) {
      setStatus(error?.shortMessage || error?.message || String(error));
    }
  };

  const loadTasks = async (activeContract = contract) => {
    try {
      if (!activeContract) return;
      const rawTasks = await activeContract.getMyTasks();
      setTasks(normalizeTasks(rawTasks));
    } catch (error) {
      setStatus(error?.shortMessage || error?.message || String(error));
    }
  };

  const addTask = async () => {
    try {
      setStatus("");

      if (!contract) {
        setStatus("Koble til MetaMask først.");
        return;
      }

      const trimmed = description.trim();
      if (!trimmed) {
        setStatus("Beskrivelse kan ikke være tom.");
        return;
      }

      const tx = await contract.addTask(trimmed, isPrivate);
      setStatus("Venter på bekreftelse i blockchain...");
      await tx.wait();

      setDescription("");
      setIsPrivate(false);

      await loadTasks();
      setStatus("Oppgave lagt til.");
    } catch (error) {
      setStatus(error?.shortMessage || error?.message || String(error));
    }
  };

  const completeTask = async (taskId) => {
    try {
      setStatus("");

      if (!contract) {
        setStatus("Koble til MetaMask først.");
        return;
      }

      const tx = await contract.completeTask(taskId);
      setStatus("Venter på bekreftelse i blockchain...");
      await tx.wait();

      await loadTasks();
      setStatus("Oppgave fullført.");
    } catch (error) {
      setStatus(error?.shortMessage || error?.message || String(error));
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", connect);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", connect);
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>To-Do dApp</h1>

      <button onClick={connect} style={{ marginBottom: "20px", padding: "10px 16px" }}>
        Koble til MetaMask
      </button>

      {account && (
        <p>
          <strong>Innlogget konto:</strong> {account}
        </p>
      )}

      <div style={{ marginBottom: "24px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Legg til oppgave</h2>

        <input
          type="text"
          placeholder="Beskrivelse"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        />

        <label style={{ display: "block", marginBottom: "12px" }}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Privat oppgave
        </label>

        <button onClick={addTask} style={{ padding: "10px 16px" }}>
          Legg til
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h2>Mine synlige oppgaver</h2>
        <button onClick={() => loadTasks()} style={{ marginBottom: "16px", padding: "8px 14px" }}>
          Oppdater liste
        </button>

        {tasks.length === 0 ? (
          <p>Ingen synlige oppgaver.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "14px",
                marginBottom: "12px",
              }}
            >
              <p><strong>ID:</strong> {task.id}</p>
              <p><strong>Beskrivelse:</strong> {task.description}</p>
              <p><strong>Opprettet:</strong> {formatTimestamp(task.createdAt)}</p>
              <p><strong>Fullført:</strong> {task.completed ? "Ja" : "Nei"}</p>
              <p><strong>CompletedAt:</strong> {formatTimestamp(task.completedAt)}</p>
              <p><strong>Bruker:</strong> {task.user}</p>
              <p><strong>Privat:</strong> {task.isPrivate ? "Ja" : "Nei"}</p>

              {!task.completed && task.user.toLowerCase() === account.toLowerCase() && (
                <button onClick={() => completeTask(task.id)} style={{ padding: "8px 12px" }}>
                  Fullfør oppgave
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {status && (
        <div style={{ padding: "12px", background: "#f3f3f3", borderRadius: "8px" }}>
          {status}
        </div>
      )}
    </div>
  );
}