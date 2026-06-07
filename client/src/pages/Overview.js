import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  return (
    <div>
      <h2>Overview</h2>
      {habits.length === 0 ? (
        <p>No habits yet — add one on the Today page!</p>
      ) : (
        habits.map((habit) => (
          <div key={habit.id}>
            <h3
              onClick={() => navigate(`/habit/${habit.id}`)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {habit.name}
            </h3>
            <p>{habit.description}</p>
            <p>Frequency: {habit.frequency}</p>
            <p>
              Total completions:{" "}
              {completions[habit.id] ? completions[habit.id].length : 0}
            </p>
            <p>
              Started: {new Date(habit.created_at.replace(" ", "T")).toLocaleDateString()}
            </p>
            <button onClick={() => handleDelete(habit)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Overview;