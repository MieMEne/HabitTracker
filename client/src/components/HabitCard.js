import axios from "axios";

function HabitCard({ habit, isCompleted, onComplete }) {
  const handleComplete = async () => {
    if (isCompleted) return;
    await axios.post(`http://localhost:3001/api/habits/${habit.id}/complete`);
    onComplete();
  };

  return (
    <div style={{ opacity: isCompleted ? 0.5 : 1 }}>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <p>Frequency: {habit.frequency}</p>
      <button onClick={handleComplete} disabled={isCompleted}>
        {isCompleted ? "✓ Done" : "✓ Mark as done"}
      </button>
    </div>
  );
}

export default HabitCard