import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [skips, setSkips] = useState([]);

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

      const skipsResponse = await axios.get(
        `http://localhost:3001/api/habits/${id}/skips`
      );
      setSkips(skipsResponse.data);
    };
    fetchData();
  }, [id]);

  if (!habit) return <p>Loading...</p>;

  const formatDate = (dateString) =>
    new Date(dateString.replace(" ", "T")).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div>
      <button onClick={() => navigate("/overview")}>← Back to Overview</button>
      <h2>{habit.name}</h2>
      <p>{habit.description}</p>
      <p>Frequency: {habit.frequency}</p>
      <p>Started: {new Date(habit.created_at.replace(" ", "T")).toLocaleDateString()}</p>
      <p>Total completions: {completions.length}</p>
      <p>Total skips: {skips.length}</p>

      <h3>Completion History</h3>
      {completions.length === 0 ? (
        <p>No completions yet!</p>
      ) : (
        <ul>
          {completions.map((completion) => (
            <li key={completion.id}>{formatDate(completion.completed_at)}</li>
          ))}
        </ul>
      )}

      <h3>Skip History</h3>
      {skips.length === 0 ? (
        <p>No skips yet!</p>
      ) : (
        <ul>
          {skips.map((skip) => (
            <li key={skip.id}>{formatDate(skip.skipped_at)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HabitDetail;