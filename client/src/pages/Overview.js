import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditHabitForm from "../components/EditHabitForm";

function OverviewCard({ habit, completions, onDelete, onEdit, navigate, lightenColor }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="overview-card">
        {habit.illustration ? (
          <div className="overview-illus" style={{ background: lightenColor(habit.color) }}>
            <img
              src={`http://localhost:3001${habit.illustration}`}
              alt={habit.name}
            />
          </div>
        ) : (
          <div className="overview-illus-empty" style={{ background: lightenColor(habit.color) }} />
        )}
        <div className="overview-body">
          <div
            className="overview-name"
            onClick={() => navigate(`/habit/${habit.id}`, { state: { from: "overview" } })}
          >
            {habit.name}
          </div>
          <div className="overview-meta">
            {habit.frequency} · started{" "}
            {new Date(habit.created_at.replace(" ", "T")).toLocaleDateString()}
          </div>
          <div className="overview-footer">
            <span
              className="frequency-tag"
              style={{ background: lightenColor(habit.color), color: habit.color }}
            >
              {completions[habit.id] ? completions[habit.id].length : 0} completions
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <div className="icon-btn" onClick={() => setShowEdit(true)}>
                <span>✏️</span>
                <div className="tooltip">Edit habit</div>
              </div>
              <div className="icon-btn danger" onClick={() => onDelete(habit)}>
                <span>🗑</span>
                <div className="tooltip">Delete habit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEdit && (
        <EditHabitForm
          habit={habit}
          onHabitUpdated={onEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}

function Overview() {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    const habitsResponse = await axios.get("http://localhost:3001/api/habits");
    const habits = habitsResponse.data;
    setHabits(habits);

    const completionsMap = {};
    await Promise.all(
      habits.map(async (habit) => {
        const response = await axios.get(
          `http://localhost:3001/api/habits/${habit.id}/completions`
        );
        completionsMap[habit.id] = response.data;
      })
    );
    setCompletions(completionsMap);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (habit) => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      await axios.delete(`http://localhost:3001/api/habits/${habit.id}`);
      fetchData();
    }
  };

  const lightenColor = (hex) => `${hex}33`;

  return (
    <div className="page">
      <div className="page-title">Overview</div>
      <div className="page-subtitle">{habits.length} habits tracked</div>
      {habits.length === 0 ? (
        <p style={{ marginTop: "20px", color: "#b0a49a" }}>
          No habits yet — add one on the Today page!
        </p>
      ) : (
        <div className="overview-grid">
          {habits.map((habit) => (
            <OverviewCard
              key={habit.id}
              habit={habit}
              completions={completions}
              onDelete={handleDelete}
              onEdit={fetchData}
              navigate={navigate}
              lightenColor={lightenColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Overview;