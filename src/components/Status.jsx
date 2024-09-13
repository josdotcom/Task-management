import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import "./Status.css";
import { ReactComponent as BacklogIcon } from "../Assets/icons/Backlog.svg";
import { ReactComponent as TodoIcon } from "../Assets/icons/To-do.svg";
import { ReactComponent as InProgressIcon } from "../Assets/icons/in-progress.svg";
import { ReactComponent as DoneIcon } from "../Assets/icons/Done.svg";
import { ReactComponent as CancelledIcon } from "../Assets/icons/Cancelled.svg";
import { ReactComponent as Dot } from "../Assets/icons/3 dot menu.svg";
import { ReactComponent as Add } from "../Assets/icons/add.svg";

export function Status({ ordering }) {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
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
        const grouped = groupTicketsByStatus(data.tickets);
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

  const statuses = ["Backlog", "Todo", "In progress", "Done", "Completed"];

  const sortTickets = (tickets) => {
    if (ordering === "Priority") {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (ordering === "Title") {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  // Map statuses to their corresponding SVG icons
  const statusIcons = {
    Backlog: <BacklogIcon />,
    Todo: <TodoIcon />,
    "In progress": <InProgressIcon />,
    Done: <DoneIcon />,
    Completed: <CancelledIcon />,
  };

  return (
    <div className="status-container">
      <div className="grouped-cards">
        {statuses.map((status) => (
          <div key={status} className="status-column">
            <div className="status-header">
              <div className="status-title">
                {statusIcons[status]}
                <p>{status}</p>
                <p className="status-count">
                  {groupedData[status]?.length || 0}
                </p>
              </div>
              <div>
                <Add />
                <Dot />
              </div>
            </div>
            <div className="cards">
              {sortTickets(groupedData[status] || []).map((ticket) => (
                <Card
                  key={ticket.id}
                  item={ticket}
                  users={users}
                  grouping="Status"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupTicketsByStatus(tickets) {
  const grouped = tickets.reduce((acc, ticket) => {
    const { status } = ticket;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(ticket);
    return acc;
  }, {});

  // Ensure all statuses are included, even if they have no tickets
  const statuses = ["Backlog", "Todo", "In progress", "Done", "Completed"];
  statuses.forEach((status) => {
    if (!grouped[status]) {
      grouped[status] = [];
    }
  });

  return grouped;
}
