import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function HabitCalendar({ completions, skips, color }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Date(year, month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const adjustedFirstDay = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const completedDates = new Set(
    completions.map((c) =>
      new Date(c.completed_at.replace(" ", "T")).toLocaleDateString("en-CA")
    )
  );

  const skippedDates = new Set(
    skips.map((s) =>
      new Date(s.skipped_at.replace(" ", "T")).toLocaleDateString("en-CA")
    )
  );

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const isNextDisabled =
    year === today.getFullYear() && month === today.getMonth();

  const days = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-arrow" onClick={prevMonth}>←</button>
        <span className="cal-title">{monthName}</span>
        <button className="cal-arrow" onClick={nextMonth} disabled={isNextDisabled}
          style={{ opacity: isNextDisabled ? 0.3 : 1 }}>→</button>
      </div>
      <div className="cal-grid">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="day-label">{d}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="cal-day" />;

          const dateStr = new Date(year, month, day)
            .toLocaleDateString("en-CA");
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const isCompleted = completedDates.has(dateStr);
          const isSkipped = skippedDates.has(dateStr);

          let style = {};
          let className = "cal-day";

          if (isCompleted) {
            style = { background: color, color: "white" };
          } else if (isSkipped) {
            style = { background: "#c8c0b8", color: "white" };
          } else if (isToday) {
            style = { border: `2px solid ${color}`, fontWeight: 600 };
          }

          return (
            <div key={dateStr} className={className} style={style}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="cal-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: color }} />
          Completed
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "#c8c0b8" }} />
          Skipped
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ border: `2px solid ${color}` }} />
          Today
        </div>
      </div>
    </div>
  );
}

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

  const lightenColor = (hex) => `${hex}33`;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/overview")}>
        ← Back to Overview
      </button>

      {habit.illustration ? (
        <div className="detail-banner" style={{ background: lightenColor(habit.color) }}>
          <img
            src={`http://localhost:3001${habit.illustration}`}
            alt={habit.name}
          />
        </div>
      ) : (
        <div className="detail-banner-empty" style={{ background: lightenColor(habit.color) }} />
      )}

      <div className="detail-title">{habit.name}</div>
      <div className="detail-meta">{habit.description}</div>

      <div className="stats-row">
        <span className="stat-pill" style={{ background: lightenColor(habit.color), color: habit.color }}>
          {habit.frequency}
        </span>
        <span className="stat-pill" style={{ background: "#edf6ea", color: "#4a7c42" }}>
          {completions.length} completions
        </span>
        <span className="stat-pill" style={{ background: "#f5f0ea", color: "#6a5e55" }}>
          {skips.length} skips
        </span>
        <span className="stat-pill" style={{ background: "#f5f0ea", color: "#6a5e55" }}>
          Since {new Date(habit.created_at.replace(" ", "T")).toLocaleDateString()}
        </span>
      </div>

      <div className="section-title">History</div>
      <HabitCalendar
        completions={completions}
        skips={skips}
        color={habit.color}
      />
    </div>
  );
}

export default HabitDetail;