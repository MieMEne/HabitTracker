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
  ) - habit.shift_days;

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
  const [todayCompletions, setTodayCompletions] = useState({});
  const [allCompletions, setAllCompletions] = useState({});
  const [skippedIds, setSkippedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchHabits = async () => {
    const response = await axios.get("http://localhost:3001/api/habits");
    setHabits(response.data);
  };

  const fetchTodayCompletions = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/habits/completions/today"
    );
    const map = {};
    response.data.forEach((c) => {
      map[c.habit_id] = c.count;
    });
    setTodayCompletions(map);
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

  const fetchTodaySkips = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/habits/skips/today"
    );
    setSkippedIds(response.data.map((s) => s.habit_id));
  };

  const handleRefresh = () => {
    fetchHabits();
    fetchTodayCompletions();
    fetchAllCompletions();
    fetchTodaySkips();
  };

  useEffect(() => {
    fetchHabits();
    fetchTodayCompletions();
    fetchAllCompletions();
    fetchTodaySkips();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const dueToday = habits.filter(
    (habit) =>
      isDueToday(habit, allCompletions[habit.id] || []) &&
      !skippedIds.includes(habit.id)
  );

  const incomplete = dueToday.filter(
    (habit) => (todayCompletions[habit.id] || 0) < habit.times_per_day
  );

  const completed = dueToday.filter(
    (habit) => (todayCompletions[habit.id] || 0) >= habit.times_per_day
  );

  return (
    <div className="page">
      <div className="page-title">
        {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      <div className="page-subtitle">
        {completed.length} of {dueToday.length} habits done today
      </div>

      {dueToday.length === 0 ? (
        <p style={{ marginTop: "20px", color: "#b0a49a" }}>No habits due today — enjoy your rest!</p>
      ) : (
        <>
          {incomplete.length > 0 && (
            <div>
              <div className="section-label">To do</div>
              {incomplete.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completedCount={todayCompletions[habit.id] || 0}
                  isCompleted={false}
                  onComplete={handleRefresh}
                  onDelete={handleRefresh}
                  onSkip={handleRefresh}
                />
              ))}
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <div className="section-label">Completed</div>
              <div className="completed-grid">
                {completed.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completedCount={todayCompletions[habit.id] || 0}
                    isCompleted={true}
                    onComplete={handleRefresh}
                    onDelete={handleRefresh}
                    onSkip={handleRefresh}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {showForm && (
        <AddHabitForm
          onHabitAdded={handleRefresh}
          onClose={() => setShowForm(false)}
        />
      )}
      <button className="add-habit-btn" onClick={() => setShowForm(true)}>
        + Add a new habit
      </button>
    </div>
  );
}

export default Today;