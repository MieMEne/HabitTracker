import axios from "axios";

function HabitCard({ habit, onComplete }) {
  const handleComplete = async () => {
    await axios.post(`http://localhost:3001/api/habits/${habit.id}/complete`);
    onComplete();
  };

  return (
    <div>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <p>Frequency: {habit.frequency}</p>
      <button onClick={handleComplete}>✓ Mark as done</button>
    </div>
  );
}

export default HabitCard;