import { useState, useEffect } from "react";
import axios from "axios";
import HabitCard from "../components/HabitCard";
import AddHabitForm from "../components/AddHabitForm";

function Today() {
  const [habits, setHabits] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);

  const fetchHabits = async () => {
    const response = await axios.get("http://localhost:3001/api/habits");
    setHabits(response.data);
  };

  const fetchTodayCompletions = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/habits/completions/today"
    );
    const ids = response.data.map((c) => c.habit_id);
    setCompletedIds(ids);
  };

  useEffect(() => {
    fetchHabits();
    fetchTodayCompletions();
  }, []);

  const handleRefresh = () => {
    fetchHabits();
    fetchTodayCompletions();
  };

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
            isCompleted={completedIds.includes(habit.id)}
            onComplete={handleRefresh}
          />
        ))
      )}
      <AddHabitForm onHabitAdded={handleRefresh} />
    </div>
  );
}

export default Today;