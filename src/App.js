import React, { useEffect, useState } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { Priority } from "./components/Priority";
import { Status } from "./components/Status";
import { UserGroup } from "./components/UserGroup";

// Utility functions to handle local storage
const saveStateToLocalStorage = (state) => {
  localStorage.setItem('appState', JSON.stringify(state));
};

const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem('appState');
  return savedState ? JSON.parse(savedState) : { selectedComponent: "Status", ordering: "Priority" };
};

function App() {
  // Load the initial state from local storage
  const initialState = loadStateFromLocalStorage();
  const [selectedComponent, setSelectedComponent] = useState(initialState.selectedComponent);
  const [ordering, setOrdering] = useState(initialState.ordering);

  useEffect(() => {
    // Save the state to local storage whenever it changes
    saveStateToLocalStorage({ selectedComponent, ordering });
  }, [selectedComponent, ordering]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Status":
        return <Status ordering={ordering} />;
      case "UserGroup":
        return <UserGroup ordering={ordering} />;
      case "Priority":
        return <Priority ordering={ordering} />;
      default:
        return <Status ordering={ordering} />;
    }
  };

  return (
    <div className="App">
      <Navbar selectedComponent = {selectedComponent} ordering = {ordering} setSelectedComponent={setSelectedComponent} setOrdering={setOrdering} />
      {renderComponent()}
    </div>
  );
}

export default App;
