import { useState, useEffect } from "react";
import axios from "axios";
import HabitCard from "../components/HabitCard";
import AddHabitForm from "../components/AddHabitForm";

function isDueToday(habit, completions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const created = new Date(habit.created_at.replace(" ", "T"));
  created.setHours(0, 0, 0, 0);

  const daysSinceCreation = Math.floor(
    (today - created) / (1000 * 60 * 60 * 24)
  );

  const lastCompletion =
    completions.length > 0
      ? new Date(completions[completions.length - 1].completed_at.replace(" ", "T"))
      : null;

  if (lastCompletion) lastCompletion.setHours(0, 0, 0, 0);

  const daysSinceLastCompletion = lastCompletion
    ? Math.floor((today - lastCompletion) / (1000 * 60 * 60 * 24))
    : null;

  switch (habit.frequency) {
    case "daily":
      return true;
    case "every other day":
      return daysSinceCreation % 2 === 0;
    case "every 4 days":
      return daysSinceCreation % 4 === 0;
    case "weekly":
      if (daysSinceLastCompletion === null) return daysSinceCreation >= 7 || daysSinceCreation === 0;
      return daysSinceLastCompletion >= 7;
    case "monthly":
      if (daysSinceLastCompletion === null) return daysSinceCreation >= 30 || daysSinceCreation === 0;
      return daysSinceLastCompletion >= 30;
    default:
      return true;
  }
}

function Today() {
  const [habits, setHabits] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [allCompletions, setAllCompletions] = useState({});

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

  const fetchAllCompletions = async () => {
    const habitsResponse = await axios.get("http://localhost:3001/api/habits");
    const completionsMap = {};
    await Promise.all(
      habitsResponse.data.map(async (habit) => {
        const response = await axios.get(
          `http://localhost:3001/api/habits/${habit.id}/completions`
        );
        completionsMap[habit.id] = response.data;
      })
    );
    setAllCompletions(completionsMap);
  };

  const handleRefresh = () => {
    fetchHabits();
    fetchTodayCompletions();
    fetchAllCompletions();
  };

  useEffect(() => {
    fetchHabits();
    fetchTodayCompletions();
    fetchAllCompletions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const dueToday = habits.filter((habit) =>
    isDueToday(habit, allCompletions[habit.id] || [])
  );

  return (
    <div>
      <h2>Today's Habits</h2>
      {dueToday.length === 0 ? (
        <p>No habits due today — enjoy your rest! 🎉</p>
      ) : (
        dueToday.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            isCompleted={completedIds.includes(habit.id)}
            onComplete={handleRefresh}
            onDelete={handleRefresh}
          />
        ))
      )}
      <AddHabitForm onHabitAdded={handleRefresh} />
    </div>
  );
}

export default Today;