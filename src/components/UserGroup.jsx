import React, { useEffect, useState } from "react";
import { Card } from "./Card"; // Import your Card component
import "./UserGroup.css"; // Import the CSS for styling
import { ReactComponent as Dot } from "../Assets/icons/3 dot menu.svg";
import { ReactComponent as Add } from "../Assets/icons/add.svg";

export function UserGroup({ ordering }) {
  const [groupedData, setGroupedData] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const grouped = groupTicketsByUser(data.tickets, data.users);
        setGroupedData(grouped);
        setUsers(data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  // Sort tickets based on the ordering prop
  const sortTickets = (tickets) => {
    if (ordering === "Priority") {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (ordering === "Title") {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const getUserDetails = (userId) => {
    return (
      users.find((user) => user.id === userId) || {
        name: "Unknown User",
        profileImage: null,
        available: false,
      }
    );
  };

  // Function to get user initials
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0]; // First letter of first and last name
    }
    return nameParts[0][0]; // In case there's only one name
  };

  const getUserColor = (name) => {
    // Generate a hash code from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to a color
    const color = `#${(hash & 0x00ffffff).toString(16).padStart(6, "0")}`;
    return color;
  };

  return (
    <div className="user-container">
      <div className="grouped-cards">
        {Object.keys(groupedData).map((userId) => {
          const user = getUserDetails(userId);
          return (
            <div key={userId} className="user-column">
              <div className="user-header">
                <div className="user-details">
                  <div className="profile">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" />
                    ) : (
                      <div
                        className="initials"
                        style={{
                          backgroundColor: getUserColor(user.name),
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div
                      className={`profile-status ${
                        user.available ? "online" : "offline"
                      }`}
                    ></div>
                  </div>
                  <div className="user-title">
                    <p>{user.name}</p>
                    <p className="user-count">
                      {groupedData[userId].tickets.length || 0}
                    </p>
                  </div>
                </div>
                <div>
                  <Add />
                  <Dot />
                </div>
              </div>
              <div className="cards">
                {sortTickets(groupedData[userId].tickets).map((ticket) => (
                  <Card
                    key={ticket.id}
                    item={ticket}
                    users={users}
                    grouping="UserGroup"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Function to group tickets by user
function groupTicketsByUser(tickets, users) {
  const userMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});

  const grouped = tickets.reduce((acc, ticket) => {
    const { userId } = ticket;
    if (!acc[userId]) {
      acc[userId] = {
        userName: userMap[userId]?.name || "Unknown User",
        tickets: [],
      };
    }
    acc[userId].tickets.push(ticket);
    return acc;
  }, {});

  return grouped;
}
