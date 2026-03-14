// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TodoList {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    Task[] private tasks;
    uint private nextId;

    event TaskAdded(uint id, string content);
    event TaskCompleted(uint id, bool completed);

    function addTask(string memory _content) public {
        tasks.push(Task(nextId, _content, false));
        emit TaskAdded(nextId, _content);
        nextId++;
    }

    function completeTask(uint _id) public {
        require(_id < tasks.length, "Task does not exist");
        tasks[_id].completed = true;
        emit TaskCompleted(_id, true);
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }
}