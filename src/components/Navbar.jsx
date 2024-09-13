import React, { useState } from "react";
import "./Navbar.css";

import { ReactComponent as Down } from "../Assets/icons/down.svg";
import { ReactComponent as Display } from "../Assets/icons/Display.svg";

export function Navbar({ selectedComponent, ordering, setSelectedComponent, setOrdering }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isGroupingDropdownOpen, setGroupingDropdownOpen] = useState(false);
  const [isOrderingDropdownOpen, setOrderingDropdownOpen] = useState(false);
  const [selectedGrouping, setSelectedGrouping] = useState(selectedComponent);
  const [selectedOrdering, setSelectedOrdering] = useState(ordering);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const toggleGroupingDropdown = () =>
    setGroupingDropdownOpen(!isGroupingDropdownOpen);
  const toggleOrderingDropdown = () =>
    setOrderingDropdownOpen(!isOrderingDropdownOpen);

  const handleGroupingSelect = (option) => {
    setSelectedGrouping(option);
    setGroupingDropdownOpen(false);
    setSelectedComponent(option);
  };

  const handleOrderingSelect = (option) => {
    setSelectedOrdering(option);
    setOrdering(option);
    setOrderingDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
          <Display />
          <p>Display</p>
          <Down />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <div className="dropdown-item-first">
              <p>Grouping</p>
              <p onClick={toggleGroupingDropdown} className="nested">{selectedGrouping} <Down /></p>
              
              {isGroupingDropdownOpen && (
                <div className="nested-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => handleGroupingSelect("Status")}
                  >
                    <p>Status</p>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleGroupingSelect("UserGroup")}
                  >
                    <p>User</p>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleGroupingSelect("Priority")}
                  >
                    <p>Priority</p>
                  </div>
                </div>
              )}
            </div>
            <div className="dropdown-item-first">
              <p>Ordering</p>
              <p onClick={toggleOrderingDropdown} className="nested">{selectedOrdering} <Down /></p>
              {isOrderingDropdownOpen && (
                <div className="nested-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => handleOrderingSelect("Priority")}
                  >
                    <p>Priority</p>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleOrderingSelect("Title")}
                  >
                    <p>Title</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
