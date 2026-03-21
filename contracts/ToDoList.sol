// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Smart contract for  managing a decentralized To-Do list
contract ToDoList {

// Struct representing a task
    struct Task {
        uint id;    //Unique identifier for task
        string description;     // Task description 
        uint createdAt;     // Timestamp when task was created
        uint completedAt;   //Timestamp when task was completed
        address user;       //Address of the task owner
        bool isPrivate;     // Whether the task is private or public
        bool completed;     // Is the task completed?
    } 

  uint public taskCount; // Counter to keep track of total tasks

    // Mapping that stores all tasks by ID
    mapping(uint => Task) public tasks;

    // Event emitted when a new task is created
    event TaskCreated(uint id, string description, address user, bool isPrivate);

    // Event emitted when a task is marked as completed
    event TaskCompleted(uint id, uint completedAt);

    // Function to create a new task
    function addTask(string memory _description, bool _isPrivate) public {
        taskCount++; // Increment task counter

        // Store the new task in the mapping
        tasks[taskCount] = Task(
            taskCount,
            _description,
            block.timestamp, // Current blockchain timestamp
            0,               // Not completed yet
            msg.sender,      // Address of the creator
            _isPrivate,
            false            // Initially not completed
        );

        // Emit event so frontend can detect the change
        emit TaskCreated(taskCount, _description, msg.sender, _isPrivate);
    }

    // Function to mark a task as completed
    function completeTask(uint _id) public {
        Task storage task = tasks[_id];

        // Ensure that only the owner can complete the task
        require(task.user == msg.sender, "Not your task");

        // Ensure the task is not already completed
        require(!task.completed, "Task already completed");

        task.completed = true;
        task.completedAt = block.timestamp;

        // Emit event after completion
        emit TaskCompleted(_id, block.timestamp);
    }

    // Function to retrieve tasks that the user is allowed to see
    function getMyTasks() public view returns (Task[] memory) {
        uint count = 0;

        // First loop: count how many tasks are visible to the user
        for (uint i = 1; i <= taskCount; i++) {
            if (
                tasks[i].user == msg.sender || // User owns the task
                !tasks[i].isPrivate           // Task is public
            ) {
                count++;
            }
        }

        // Create array with correct size
        Task[] memory result = new Task[](count);

        uint index = 0;

        // Second loop: populate the array with visible tasks
        for (uint i = 1; i <= taskCount; i++) {
            if (
                tasks[i].user == msg.sender ||
                !tasks[i].isPrivate
            ) {
                result[index] = tasks[i];
                index++;
            }
        }

        return result;
    }
}