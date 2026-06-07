import axios from "axios";

function HabitCard({ habit, isCompleted, completedCount, onComplete, onDelete, onSkip }) {
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

  const handleSkip = async () => {
    await axios.post(`http://localhost:3001/api/habits/${habit.id}/skip`);
    onSkip();
  };

  const handleShift = async () => {
    await axios.post(`http://localhost:3001/api/habits/${habit.id}/shift`);
    onSkip();
  };

  return (
    <div style={{ opacity: isCompleted ? 0.5 : 1 }}>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <p>Frequency: {habit.frequency}</p>
      {habit.times_per_day > 1 && (
        <p>Progress: {completedCount}/{habit.times_per_day} times</p>
      )}
      <button onClick={handleComplete} disabled={isCompleted}>
        {isCompleted ? "✓ Done" : "✓ Mark as done"}
      </button>
      {!isCompleted && (
        <>
          <button onClick={handleSkip}>Skip today</button>
          <button onClick={handleShift}>Shift by 1 day</button>
        </>
      )}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default HabitCard;