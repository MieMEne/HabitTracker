export function calculateStreak(completions, frequency) {
  if (!completions || completions.length === 0) return 0;

  const toLocal = (dateStr) =>
    new Date(new Date(dateStr.replace(" ", "T")).toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));

  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
  today.setHours(0, 0, 0, 0);

  const dates = [...new Set(
    completions.map((c) => {
      const d = toLocal(c.completed_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )]
    .sort((a, b) => b - a)
    .map((t) => new Date(t));

  if (dates.length === 0) return 0;

  const getPeriodStart = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (frequency === "weekly") {
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    } else if (frequency === "monthly") {
      d.setDate(1);
    }
    return d.getTime();
  };

  const getExpectedGap = () => {
    switch (frequency) {
      case "daily": return 1;
      case "every other day": return 2;
      case "every 4 days": return 4;
      case "weekly": return 7;
      case "monthly": return 30;
      default: return 1;
    }
  };

  if (frequency === "weekly" || frequency === "monthly") {
    const periods = [...new Set(dates.map((d) => getPeriodStart(d)))]
      .sort((a, b) => b - a);

    const currentPeriod = getPeriodStart(today);
    let streak = 0;
    let expectedPeriod = currentPeriod;

    for (const period of periods) {
      if (period === expectedPeriod) {
        streak++;
        if (frequency === "weekly") {
          expectedPeriod = new Date(expectedPeriod - 7 * 24 * 60 * 60 * 1000).getTime();
        } else {
          const d = new Date(expectedPeriod);
          d.setMonth(d.getMonth() - 1);
          expectedPeriod = d.getTime();
        }
      } else {
        break;
      }
    }
    return streak;
  }

  const gap = getExpectedGap();
  let streak = 0;
  let expectedDate = new Date(today);

  const mostRecent = dates[0];
  const daysSinceMostRecent = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
  if (daysSinceMostRecent > gap) return 0;

  expectedDate = new Date(mostRecent);

  for (const date of dates) {
    const diff = Math.floor((expectedDate - date) / (1000 * 60 * 60 * 24));
    if (Math.abs(diff) <= gap) {
      streak++;
      expectedDate = new Date(date.getTime() - gap * 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(completions, frequency) {
  if (!completions || completions.length === 0) return 0;

  const toLocal = (dateStr) =>
    new Date(new Date(dateStr.replace(" ", "T")).toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));

  const dates = [...new Set(
    completions.map((c) => {
      const d = toLocal(c.completed_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )]
    .sort((a, b) => a - b)
    .map((t) => new Date(t));

  const gap = frequency === "daily" ? 1
    : frequency === "every other day" ? 2
    : frequency === "every 4 days" ? 4
    : frequency === "weekly" ? 7
    : 30;

  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = Math.floor((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
    if (diff <= gap) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}