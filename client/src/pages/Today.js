import { useState, useEffect } from "react";
import axios from "axios";
import HabitCard from "../components/HabitCard";
import AddHabitForm from "../components/AddHabitForm";

function isDueToday(habit, completions, todayCompletionCount) {
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

    case "weekly": {
      const startOfCurrentWeek = new Date(today);
      startOfCurrentWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      startOfCurrentWeek.setHours(0, 0, 0, 0);
      const completionsThisWeek = completions.filter((c) => {
        const d = new Date(c.completed_at.replace(" ", "T"));
        d.setHours(0, 0, 0, 0);
        return d >= startOfCurrentWeek;
      });
      return completionsThisWeek.length < habit.times_per_day;
    }

    case "monthly": {
      const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const completionsThisMonth = completions.filter((c) => {
        const d = new Date(c.completed_at.replace(" ", "T"));
        d.setHours(0, 0, 0, 0);
        return d >= startOfCurrentMonth;
      });
      return completionsThisMonth.length < habit.times_per_day;
    }

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
    isDueToday(habit, allCompletions[habit.id] || [], todayCompletions[habit.id] || 0) &&
    !skippedIds.includes(habit.id)
);

  const incomplete = dueToday.filter(
  (habit) => (todayCompletions[habit.id] || 0) < habit.times_per_day
);

const completed = dueToday.filter(
  (habit) => (todayCompletions[habit.id] || 0) >= habit.times_per_day
);

const completedPeriodic = habits.filter((habit) => {
  if (skippedIds.includes(habit.id)) return false;
  if (habit.frequency !== "weekly" && habit.frequency !== "monthly") return false;

  const allHabitCompletions = allCompletions[habit.id] || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (habit.frequency === "weekly") {
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfCurrentWeek.setHours(0, 0, 0, 0);
    const completionsThisWeek = allHabitCompletions.filter((c) => {
      const d = new Date(c.completed_at.replace(" ", "T"));
      d.setHours(0, 0, 0, 0);
      return d >= startOfCurrentWeek;
    });
    return completionsThisWeek.length >= habit.times_per_day;
  }

  if (habit.frequency === "monthly") {
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const completionsThisMonth = allHabitCompletions.filter((c) => {
      const d = new Date(c.completed_at.replace(" ", "T"));
      d.setHours(0, 0, 0, 0);
      return d >= startOfCurrentMonth;
    });
    return completionsThisMonth.length >= habit.times_per_day;
  }

  return false;
});

  return (
    <div className="page">
      <div className="page-title">
        {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      <div className="page-subtitle">
        {completed.length + completedPeriodic.length} of {dueToday.length + completedPeriodic.length} habits done today
      </div>

      {dueToday.length === 0 && completedPeriodic.length === 0 ? (
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
          {(completed.length > 0 || completedPeriodic.length > 0) && (
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
                {completedPeriodic.map((habit) => (
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