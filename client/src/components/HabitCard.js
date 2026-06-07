import axios from "axios";

function HabitCard({ habit, isCompleted, onComplete, onDelete }) {
  const handleComplete = async () => {
    if (isCompleted) return;
    await axios.post(`http://localhost:3001/api/habits/${habit.id}/complete`);
    onComplete();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      await axios.delete(`http://localhost:3001/api/habits/${habit.id}`);
      onDelete();
    }
  };

  return (
    <div style={{ opacity: isCompleted ? 0.5 : 1 }}>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <p>Frequency: {habit.frequency}</p>
      <button onClick={handleComplete} disabled={isCompleted}>
        {isCompleted ? "✓ Done" : "✓ Mark as done"}
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default HabitCard;