import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import "./Priority.css";
import { ReactComponent as Priority0 } from "../Assets/icons/No-priority.svg";
import { ReactComponent as Priority1 } from "../Assets/icons/Img - Low Priority.svg";
import { ReactComponent as Priority2 } from "../Assets/icons/Img - Medium Priority.svg";
import { ReactComponent as Priority3 } from "../Assets/icons/Img - High Priority.svg";
import { ReactComponent as Priority4 } from "../Assets/icons/SVG - Urgent Priority colour.svg";
import { ReactComponent as Dot } from "../Assets/icons/3 dot menu.svg";
import { ReactComponent as Add } from "../Assets/icons/add.svg";

export function Priority({ ordering }) {
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
        const grouped = groupTicketsByPriority(data.tickets);
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

  const priorityOrder = [0, 4, 3, 2, 1];

  const sortTickets = (tickets) => {
    if (ordering === "Priority") {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (ordering === "Title") {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4:
        return <Priority4 />;
      case 3:
        return <Priority3 />;
      case 2:
        return <Priority2 />;
      case 1:
        return <Priority1 />;
      case 0:
        return <Priority0 />;
      default:
        return null;
    }
  };

  return (
    <div className="priority-container">
      <div className="grouped-cards">
        {priorityOrder.map((priority) => (
          <div key={priority} className="priority-column">
            <div className="priority-header">
              <div className="priority-title">
                {getPriorityIcon(priority)}
                <p>{getPriorityLabel(priority)}</p>
                <p className="priority-count">
                  {" "}
                  {groupedData[priority]?.length || 0}
                </p>
              </div>
              <div>
                <Add />
                <Dot />
              </div>
            </div>
            <div className="cards">
              {sortTickets(groupedData[priority] || []).map((ticket) => (
                <Card
                  key={ticket.id}
                  item={ticket}
                  users={users}
                  grouping="Priority"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupTicketsByPriority(tickets) {
  const grouped = tickets.reduce((acc, ticket) => {
    const { priority } = ticket;
    if (!acc[priority]) {
      acc[priority] = [];
    }
    acc[priority].push(ticket);
    return acc;
  }, {});

  const priorities = [0, 1, 2, 3, 4];
  priorities.forEach((priority) => {
    if (!grouped[priority]) {
      grouped[priority] = [];
    }
  });

  return grouped;
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 4:
      return "Urgent";
    case 3:
      return "High";
    case 2:
      return "Medium";
    case 1:
      return "Low";
    case 0:
      return "No Priority";
    default:
      return "Unknown";
  }
}
