import React, { useState, useEffect } from 'react';

export default function Group() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isexpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupDetails, setGroupDetails] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [groupExpenses, setGroupExpenses] = useState([]);  // New state for group expenses
  const [name, setName] = useState('');
const [note, setNote] = useState('');
const [type, setType] = useState('');
const [amount, setAmount] = useState('');
const [group, setGroup] = useState('');




const handleAddExpense = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please login to continue.");
    return;
  }

  const newExpense = {
    name,
    note,
    type,
    amount: parseFloat(amount),
    group: selectedGroupId, // assuming this is the selected group
  };

  try {
    const response = await fetch("http://localhost:3001/api/expenseRoute/expenseCreate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: token, // sending token in header
      },
      body: JSON.stringify(newExpense),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Expense added successfully!");
      setIsExpenseModalOpen(false);
      fetchGroupExpenses(selectedGroupId);
      
      // Reset fields if needed
    } else {
      alert(data.error || "Failed to add expense.");
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Something went wrong!");
  }
};



  // ✅ Fetch user's groups
  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/group/my-groups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
      });

      const data = await response.json();
      if (response.ok) {
        setGroups(data.groups);
      } else {
        throw new Error(data.message || "Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error.message);
      alert(error.message);
    }
  };

  // ✅ Fetch group details
  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/group/info/${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
      });

      const data = await response.json();
      if (response.ok) {
        setGroupDetails(data.group);
        setSelectedGroupId(groupId);
        fetchGroupExpenses(groupId); // Fetch group expenses when group details are loaded
      } else {
        throw new Error(data.message || "Failed to fetch group details");
      }
    } catch (error) {
      console.error("Error fetching group details:", error.message);
      alert(error.message);
    }
  };

  // ✅ Fetch group expenses for selected group
  const fetchGroupExpenses = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/expenseRoute/groupExpenses/${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
      });

      const data = await response.json();
      if (response.ok) {
        setGroupExpenses(data.expenses); // Save expenses to state
      } else {
        throw new Error(data.message || "Failed to fetch group expenses");
      }
    } catch (error) {
      console.error("Error fetching group expenses:", error.message);
      alert(error.message);
    }
  };

  // ✅ Create a group
  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      alert("Please enter a valid group name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
        body: JSON.stringify({ name: groupName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create group");

      alert("Group created successfully!");
      setGroups(prev => [...prev, data.group]);
      setGroupName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating group:", error.message);
      alert(error.message);
    }
  };

  // ✅ Leave group
  const handleLeaveGroup = async (groupId) => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/group/leave/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to leave group");

      alert("Left the group successfully!");
      setGroups(prev => prev.filter(group => group._id !== groupId));
      setGroupDetails(null);
      setSelectedGroupId(null);
    } catch (error) {
      console.error("Error leaving group:", error.message);
      alert(error.message);
    }
  };

  // ✅ Join group using share link
  const handleJoinGroup = async () => {
    if (joinCode.trim() === "") return alert("Enter valid group ID or code.");

    try {
      const response = await fetch(`http://localhost:3001/api/group/join/${joinCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to join group");

      alert("Joined the group successfully!");
      setJoinCode('');
      setGroups(prev => [...prev, data.group]);
    } catch (error) {
      console.error("Error joining group:", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="grid grid-cols-[25%_50%_25%] h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <div className="border-r border-gray-700 p-4">
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold">Groups</label>
          <button
            className="h-10 w-10 rounded-full bg-blue-600 text-white text-xl shadow hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        </div>

        {/* Join group input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Group ID"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
          <button
            onClick={handleJoinGroup}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 p-2 rounded"
          >
            Join Group
          </button>
        </div>

        {/* Group list */}
        <ul className="space-y-2">
          {groups.length === 0 ? (
            <li className="text-gray-400 text-center">No groups found</li>
          ) : (
            groups.map(group => (
              <li
                key={group._id}
                className={`p-2 rounded hover:bg-gray-800 flex justify-between items-center cursor-pointer ${
                  selectedGroupId === group._id ? "bg-gray-800" : ""
                }`}
                onClick={() => fetchGroupDetails(group._id)}
              >
                <span>{group.name}</span>
                <div className="space-x-2">
                  <button
                    className="text-xs bg-blue-600 px-2 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(group._id);
                      alert("Group ID copied to clipboard!");
                    }}
                  >
                    Share ID
                  </button>
                  <button
                    className="text-xs bg-red-600 px-2 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeaveGroup(group._id);
                    }}
                  >
                    Leave
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
{/* Center Section */}
<div className="border-r border-gray-700 p-6 overflow-y-auto  bg-gray-900 rounded-lg shadow-lg">
  <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-3">
    <h2 className="text-2xl font-semibold text-white">Group Expenses</h2>
    <button
      className="h-10 w-10 rounded-full bg-blue-600 text-white text-xl shadow hover:bg-blue-700"
      onClick={() => setIsExpenseModalOpen(true)}
    >
      +
    </button>
  </div>
  {groupExpenses.length > 0 ? (
    <ul className="space-y-4">
      {groupExpenses.map((expense, index) => (
        <li
          key={index}
          className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl text-white font-medium">{expense.name}</h3>
              <p className="text-gray-400 text-sm">{expense.note}</p>
            </div>
            <div className="text-lg text-white font-bold">
              ${expense.amount.toFixed(2)}
            </div>
          </div>
          <div className="mt-2 text-gray-500 text-sm">
            <span className="font-semibold text-gray-300">By:</span> {expense.user?.name}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-gray-400 text-center text-lg">No expenses found</div>
  )}
</div>


      {/* Right Sidebar */}
      <div className="p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-center mb-4 border-b border-gray-600 pb-2">Group Members</h2>
        {groupDetails ? (
          <ul className="space-y-2">
            {groupDetails.members.map(member => (
              <li key={member._id} className="p-2 bg-gray-800 rounded">
                {member.name || member.email}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-center">No group selected</div>
        )}
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded w-80">
            <h2 className="text-lg font-semibold mb-4">Create Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-400 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {isexpenseModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white p-6 rounded-lg w-96 shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Add Group Expense</h2>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
        ></textarea>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Group ID"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={() => setIsExpenseModalOpen(false)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleAddExpense}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
