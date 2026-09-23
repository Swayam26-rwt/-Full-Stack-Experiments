
import { useState, useEffect } from "react";
import "./App.css";
import { CHARACTER_LIMITS, PLATFORMS } from "./Utils";

function App() {
  


  const [platform, setPlatform] = useState("twitter");


  const [text, setText] = useState("");

  
  const [drafts, setDrafts] = useState([]);

  
  const [editingId, setEditingId] = useState(null);

  
  const [logs, setLogs] = useState([]);

  const [publishStatus, setPublishStatus] = useState("idle");

  const [retryCount, setRetryCount] = useState(0);

 
  useEffect(() => {
    const savedDrafts = localStorage.getItem("drafts");
    if (savedDrafts) {
   
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);


  function addLog(message) {
    const time = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [`${message} - ${time}`, ...prevLogs].slice());
  }


  function saveDraftsToStorage(updatedDrafts) {
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
  }

 
  const limit = CHARACTER_LIMITS[platform];
  
  const charCount = text.length;

  const isValid = charCount <= limit;


  function handleSaveDraft() {
   
    if (text.trim() === "") {
      alert("Please write something before saving!");
      return;
    }

    if (editingId) {
    
      const updatedDrafts = drafts.map((draft) =>
        draft.id === editingId ? { ...draft, platform, text } : draft
      );
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      addLog("Draft Updated");
      setEditingId(null); 
    } else {
      
      const newDraft = { id: Date.now(), platform, text };
      const updatedDrafts = [...drafts, newDraft];
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      addLog("Draft Saved");
    }


    setText("");
  }

  
  function handleEdit(draft) {
    setPlatform(draft.platform);
    setText(draft.text);
    setEditingId(draft.id); 
  }

 
  function handleDelete(id) {
    
    const updatedDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(updatedDrafts);
    saveDraftsToStorage(updatedDrafts);
    addLog("Draft Deleted");


    if (editingId === id) {
      setEditingId(null);
      setText("");
    }
  }


  function handlePublish() {
    if (!isValid || text.trim() === "") {
      alert("Fix errors before publishing!");
      return;
    }

    setPublishStatus("saving"); 

    setTimeout(() => {

      const success = Math.random() > 0.4;

      if (success) {
        setPublishStatus("success");
        addLog("Published");
        setRetryCount(0); 
      } else {
        setPublishStatus("failed");
      }
    }, 1500); 
  }


  function handleRetry() {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      handlePublish();
    }
  }

  
  const totalDrafts = drafts.length;
  const twitterCount = drafts.filter((d) => d.platform === "twitter").length;
  const linkedinCount = drafts.filter((d) => d.platform === "linkedin").length;
  const instagramCount = drafts.filter((d) => d.platform === "instagram").length;

  // ---------------- UI (JSX) ----------------
  return (
    <div className="container">
      <h1> Social Media Post Composer</h1>

      {/* ---------------- COMPOSER CARD ---------------- */}
      <div className="card">
        <h2>{editingId ? "Edit Draft" : "Create a Post"}</h2>

        {/* Dropdown to choose platform */}
        <label>Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Textarea for writing the post */}
        <textarea
          rows="5"
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
        />

        {/* Character counter, e.g. "150 / 280" */}
        <p>
          {charCount} / {limit}
        </p>

        {/* Validation message changes color based on isValid */}
        <p className={isValid ? "success-text" : "error-text"}>
          {isValid ? "Ready to Publish" : "Character limit exceeded"}
        </p>

        <div className="button-row">
          <button onClick={handleSaveDraft}>
            {editingId ? "Update Draft" : "Save Draft"}
          </button>
          <button onClick={handlePublish} disabled={!isValid}>
            Publish
          </button>
        </div>

        {/* ---------------- MOCK API STATUS ---------------- */}
        {publishStatus === "saving" && <p>⏳ Saving...</p>}
        {publishStatus === "success" && (
          <p className="success-text"> Post Published Successfully</p>
        )}
        {publishStatus === "failed" && (
          <div>
            <p className="error-text"> Save Failed</p>
            {retryCount < 3 ? (
              <button onClick={handleRetry}>
                Retry ({retryCount}/3)
              </button>
            ) : (
              <p className="error-text">Max retries reached</p>
            )}
          </div>
        )}
      </div>

      {/* ---------------- STATISTICS CARD ---------------- */}
      <div className="card">
        <h2>Statistics</h2>
        <p>Total Drafts: {totalDrafts}</p>
        <p>Twitter Drafts: {twitterCount}</p>
        <p>LinkedIn Drafts: {linkedinCount}</p>
        <p>Instagram Drafts: {instagramCount}</p>
      </div>

      {/* ---------------- DRAFTS CARD ---------------- */}
      <div className="card">
        <h2>Saved Drafts</h2>
        {drafts.length === 0 && <p>No drafts yet.</p>}

        {drafts.map((draft) => (
          <div className="draft-item" key={draft.id}>
            <p>
              <strong>{draft.platform.toUpperCase()}</strong>
            </p>
            <p>{draft.text}</p>
            <div className="button-row">
              <button onClick={() => handleEdit(draft)}>Edit</button>
              <button onClick={() => handleDelete(draft.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- ACTIVITY LOG CARD ---------------- */}
      <div className="card">
        <h2>Activity Log</h2>
        {logs.length === 0 && <p>No activity yet.</p>}
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;