import { useState, useEffect } from "react";
import axios from "axios";

const COLORS = [
  "#a8d5a2", "#f7c59f", "#c4a8d8", "#89c4e0",
  "#f0a0b8", "#f7e08a", "#a8c8e8", "#f4a896"
];

function AddHabitForm({ onHabitAdded, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [color, setColor] = useState(COLORS[0]);
  const [illustrations, setIllustrations] = useState([]);
  const [selectedIllustration, setSelectedIllustration] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  axios.get("http://localhost:3001/api/illustrations").then((res) => {
    console.log("Illustrations:", res.data);
    setIllustrations(res.data);
  });
  console.log("Colors:", COLORS);
  console.log("Selected color:", color);
}, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("illustration", file);
    const res = await axios.post(
      "http://localhost:3001/api/illustrations/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setIllustrations((prev) => [...prev, res.data]);
    setSelectedIllustration(res.data.url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    await axios.post("http://localhost:3001/api/habits", {
      name,
      description,
      frequency,
      times_per_day: timesPerDay,
      color,
      illustration: selectedIllustration,
    });
    setName("");
    setDescription("");
    setFrequency("daily");
    setTimesPerDay(1);
    setColor(COLORS[0]);
    setSelectedIllustration(null);
    onHabitAdded();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">New habit</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Frequency</label>
              <select
                className="form-input"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="every other day">Every other day</option>
                <option value="every 4 days">Every 4 days</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Times per day</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={timesPerDay}
                onChange={(e) => setTimesPerDay(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Colour</label>
            <div className="color-row">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-swatch ${color === c ? "selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Illustration</label>
            <div className="illustration-grid">
              {illustrations.map((illus) => (
                <div
                  key={illus.name}
                  className={`illus-option ${selectedIllustration === illus.url ? "selected" : ""}`}
                  onClick={() => setSelectedIllustration(
                    selectedIllustration === illus.url ? null : illus.url
                  )}
                >
                  <img
                    src={`http://localhost:3001${illus.url}`}
                    alt={illus.name}
                  />
                </div>
              ))}
              <label className="illus-upload">
                {uploading ? "Uploading..." : "+ Upload"}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <button className="submit-btn" type="submit">
            Add habit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddHabitForm;