To-Do dApp (Blockchain Project)

This project is a decentralized To-Do application (dApp) built using
Solidity (smart contract), React + Vite (frontend), Ethers.js
(blockchain interaction), MetaMask (wallet connection)

The application allows users to create tasks (public or private),
view their tasks from the blockchain, mark tasks as completed


Requirements

Before running the project, make sure you have: - Node.js installed
(v18+ recommended) - MetaMask browser extension installed - Access to a
test network (e.g., Sepolia)


IMPORTANT before running:

Before running the application, you must configure the correct smart contract address in the frontend.

Open frontend/src/ToDoApp.jsx.

You must update the const CONTRACT_ADDRESS with your depoyed smart contract, which is found in Remix after depl
Compile and deploy the ToDoList.sol contract, using Sepolia test network.
Then you can copy the Deployed Contracts ADDRESS into ToDoApp.jsx. 
This is how the program knows which contract to use for the application.


Setup and Run the Application

1. Navigate to frontend folder: cd frontend

2. Install dependencies: npm install

3. Start development server: npm run dev

4. Open the printed URL in a browser


Connect to MetaMask

1. Click “Koble til MetaMask” in the app
2. Approve connection in MetaMask
3. Make sure you are connected to the correct network (e.g., Sepolia)



Smart Contract

The smart contract is located in: contracts/ToDoList.sol

It handles: Task Creation, Task Completion, Filtering of Visible
Tasks (public/private)

The frontend interacts with the contract using: Contract Address, ABI
(TodoListABI.json)



Important Notes

- MetaMask must be installed and unlocked
- You must have test ETH (e.g., Sepolia ETH) to send transactions
- Transactions require confirmation before updates appear



How It Works:

1. Frontend connects to MetaMask
2. A contract instance is created using Ethers.js
3. User actions trigger blockchain transactions
4. Data is fetched from the smart contract and displayed in the UI



Authors

- Sindre Novi
- Even Unneberg
- Kristian Thue

