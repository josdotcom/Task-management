import React from "react";
import "./Card.css";
import { ReactComponent as Priority0 } from "../Assets/icons/No-priority.svg";
import { ReactComponent as Priority1 } from "../Assets/icons/Img - Low Priority.svg";
import { ReactComponent as Priority2 } from "../Assets/icons/Img - Medium Priority.svg";
import { ReactComponent as Priority3 } from "../Assets/icons/Img - High Priority.svg";
import { ReactComponent as Priority4 } from "../Assets/icons/SVG - Urgent Priority grey.svg";
import { ReactComponent as Done } from "../Assets/icons/Done.svg";
import { ReactComponent as Todo } from "../Assets/icons/To-do.svg";

export const Card = ({ item, users, grouping }) => {
  const priorityImages = {
    0: <Priority0 />,
    1: <Priority1 />,
    2: <Priority2 />,
    3: <Priority3 />,
    4: <Priority4 />,
  };

  const getUserName = (userId) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        return users[i].name;
      }
    }
    return "Unknown User";
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

  // Get the user information based on the ticket's userId
  const user = getUserName(item.userId);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">{item.id}</h5>

        {grouping !== "UserGroup" && (
          <div className="profile">
            {user.profileImage ? (
              <img src={user.profileImage} alt="" />
            ) : (
              <div
                className="initials"
                style={{
                  backgroundColor: getUserColor(getUserName(item.userId)),
                }}
              >
                {getInitials(getUserName(item.userId))}
              </div>
            )}
            <div
              className={`profile-status ${
                user.available ? "online" : "offline"
              }`}
            ></div>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="task-description">
          {console.log(grouping)}
          {grouping !== "Status" &&
            (item.status === "Completed" ? <Done /> : <Todo />)}
          {item.title}
        </div>
      </div>
      <div className="card-footer">
        {grouping !== "Priority" && (
          <div className="task-status-icon">
            {priorityImages[item.priority]}
          </div>
        )}
        <div className="task-name">
          <h2>{item.tag.join(", ")}</h2>
        </div>
      </div>
    </div>
  );
};
