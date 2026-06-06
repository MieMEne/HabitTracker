import { useState, useEffect } from "react";
import axios from "axios";
import HabitCard from "../components/HabitCard";
import AddHabitForm from "../components/AddHabitForm";

function Today() {
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    const response = await axios.get("http://localhost:3001/api/habits");
    setHabits(response.data);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div>
      <h2>Today's Habits</h2>
      {habits.length === 0 ? (
        <p>No habits yet — add one below!</p>
      ) : (
        habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onComplete={fetchHabits}
          />
        ))
      )}
      <AddHabitForm onHabitAdded={fetchHabits} />
    </div>
  );
}

export default Today;