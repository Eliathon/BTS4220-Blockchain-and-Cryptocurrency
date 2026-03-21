// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract ToDoList {

    struct Task {
        uint id;
        string description;
        uint createdAt;
        uint completedAt;
        address user;
        bool isPrivate;
        bool completed;
    } 

Task[] private tasks;
uint private nextId = 0;

event TaskAdded(uint id, address user, bool isPrivate);
event TaskCompleted(uint id);

function addTask(string memory _description, bool _isPrivate) public {
    require(bytes(_description).length > 0, "Description must not be empty");

    tasks.push(Task({
        id: nextId,
        description: _description,
        createdAt: block.timestamp,
        completedAt: 0,
        user: msg.sender,
        isPrivate: _isPrivate,
        completed: false
            }));
emit TaskAdded(nextId, msg.sender, _isPrivate);
nextId++;
}

function completeTask(uint _id) public {
    require(_id < tasks.length, "Task does not exist");
    Task storage task = tasks [_id];

require(task.user == msg.sender, "Not your task");
require(!task.completed, "Already completed");

task.completed = true;
task.completedAt = block.timestamp;

emit TaskCompleted(_id);
}

function getMyTasks() public view returns (Task[] memory) {
        uint count = 0;

        // Først: tell hvor mange tasks som skal vises
        for (uint i = 0; i < tasks.length; i++) {
            if (
                !tasks[i].isPrivate || 
                tasks[i].user == msg.sender
            ) {
                count++;
            }
        }

// Lager array med riktig størrelse
    Task[] memory result = new Task[](count);
    uint index = 0;

    // Fyll arrayet
    for (uint i = 0; i < tasks.length; i++) {
        if (!tasks[i].isPrivate ||
        tasks[i].user == msg.sender)
        {
            result[index] = tasks[i];
            index++;
        }
    }
return result;
}

function getTaskById(uint _id) public view returns (Task memory) {
    require(_id < tasks.length, "Task does not exist");
    return tasks[_id];
}
}
