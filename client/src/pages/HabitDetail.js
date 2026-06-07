import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const habitResponse = await axios.get(
        `http://localhost:3001/api/habits/${id}`
      );
      setHabit(habitResponse.data);

      const completionsResponse = await axios.get(
        `http://localhost:3001/api/habits/${id}/completions`
      );
      setCompletions(completionsResponse.data);
    };
    fetchData();
  }, [id]);

  if (!habit) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate("/overview")}>← Back to Overview</button>
      <h2>{habit.name}</h2>
      <p>{habit.description}</p>
      <p>Frequency: {habit.frequency}</p>
      <p>Started: {new Date(habit.created_at.replace(" ", "T")).toLocaleDateString()}</p>
      <h3>Completion History</h3>
      <p>Total completions: {completions.length}</p>
      {completions.length === 0 ? (
        <p>No completions yet!</p>
      ) : (
        <ul>
          {completions.map((completion) => (
            <li key={completion.id}>
              {new Date(completion.completed_at.replace(" ", "T")).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HabitDetail;