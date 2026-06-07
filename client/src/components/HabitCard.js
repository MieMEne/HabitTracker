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

  const illustrationUrl = habit.illustration
    ? `http://localhost:3001${habit.illustration}`
    : null;

  const lightenColor = (hex) => `${hex}33`;

  if (isCompleted) {
    return (
      <div className="habit-card-completed">
        {illustrationUrl ? (
          <div className="completed-illus" style={{ background: lightenColor(habit.color) }}>
            <img src={illustrationUrl} alt={habit.name} />
          </div>
        ) : (
          <div className="completed-illus-empty" style={{ background: lightenColor(habit.color) }} />
        )}
        <div className="completed-body">
          <div className="completed-name">{habit.name}</div>
          <div className="completed-desc">{habit.description}</div>
          <div className="completed-footer">
            <span
              className="frequency-tag"
              style={{ background: lightenColor(habit.color), color: habit.color }}
            >
              {habit.frequency}
            </span>
            {habit.times_per_day > 1 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div className="progress-dots">
                  {Array.from({ length: habit.times_per_day }).map((_, i) => (
                    <div
                      key={i}
                      className="dot"
                      style={{ background: habit.color }}
                    />
                  ))}
                </div>
                <span className="progress-count" style={{ color: habit.color }}>
                  {completedCount}/{habit.times_per_day}
                </span>
              </div>
            ) : (
              <div className="check-circle" style={{ background: habit.color }}>✓</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="habit-card-incomplete">
      {illustrationUrl ? (
        <div className="habit-banner" style={{ background: lightenColor(habit.color) }}>
          <img src={illustrationUrl} alt={habit.name} />
        </div>
      ) : (
        <div className="habit-banner-empty" style={{ background: lightenColor(habit.color) }} />
      )}
      <div className="habit-card-body">
        <div className="habit-card-top">
          <div>
            <div className="habit-name">{habit.name}</div>
            <div className="habit-desc">{habit.description}</div>
          </div>
        </div>
        <div className="habit-meta">
          <span
            className="frequency-tag"
            style={{ background: lightenColor(habit.color), color: habit.color }}
          >
            {habit.frequency}
          </span>
          {habit.times_per_day > 1 && (
            <>
              <div className="progress-dots">
                {Array.from({ length: habit.times_per_day }).map((_, i) => (
                  <div
                    key={i}
                    className="dot"
                    style={{ background: i < completedCount ? habit.color : "#e8e0d8" }}
                  />
                ))}
              </div>
              <span className="progress-count" style={{ color: habit.color }}>
                {completedCount}/{habit.times_per_day}
              </span>
            </>
          )}
        </div>
        <div className="habit-card-footer">
          <button
            className="main-btn"
            style={{ background: habit.color }}
            onClick={handleComplete}
          >
            {habit.times_per_day > 1 ? "Log session" : "Mark as done"}
          </button>
          <div className="icon-btns">
            <div className="icon-btn" onClick={handleSkip}>
              <span>⏭</span>
              <div className="tooltip">Skip today</div>
            </div>
            <div className="icon-btn" onClick={handleShift}>
              <span>📅</span>
              <div className="tooltip">Shift +1 day</div>
            </div>
            <div className="icon-btn danger" onClick={handleDelete}>
              <span>🗑</span>
              <div className="tooltip">Delete habit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitCard;