import { useState } from "react";
import axios from "axios";

function AddHabitForm({ onHabitAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    await axios.post("http://localhost:3001/api/habits", {
      name,
      description,
      frequency,
    });

    setName("");
    setDescription("");
    setFrequency("daily");
    onHabitAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Habit</h3>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Run for 30 minutes"
        />
      </div>

      <div>
        <label>Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="every other day">Every other day</option>
          <option value="every 4 days">Every 4 days</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <button type="submit">Add Habit</button>
    </form>
  );
}

export default AddHabitForm;