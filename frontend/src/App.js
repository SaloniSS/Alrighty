import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

import "./App.css";

function App() {
  const [loading, setLoading] = React.useState(false);
  const [textToAnalyze, setTextToAnalyze] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [toneData, setToneData] = useState(null);
  const [subData, setSubData] = useState(null);

  const analyzeText = async () => {
    setLoading(true);
    const response = await axios.post("http://localhost:5000/tone", {
      text: textToAnalyze,
    });
    setToneData(response.data);
    if (isChecked) {
      const response = await axios.get(
        `http://localhost:5000/subjectivity?text=${textToAnalyze}`
      );
      setSubData(response.data.subjectivity);
    }
    setLoading(false);
  };

  const getColor = (tone) => {
    switch (tone.tone_id) {
      case "analytic":
        return "blue";
      case "tentative":
        return "green";
      case "joy":
        return "blue";
      case "sadness":
        return "red";
      default:
        return "black";
    }
  };

  const displayToneData = () => {
    console.log(toneData.document_tone.tones);
    const overallTone = toneData.document_tone.tones.map((tone) => (
      <h3>
        {tone.tone_name} - {Math.floor(tone.score * 100)}%
      </h3>
    ));

    let lineByLine = null;
    if (toneData.sentences_tone) {
      lineByLine = toneData.sentences_tone.map((sentence) => {
        if (sentence.tones.length === 0) return <span>{sentence.text} </span>;
        return (
          <span
            className={getColor(
              sentence.tones.reduce((prev, current) => {
                return prev.score > current.score ? prev : current;
              })
            )}
          >
            {sentence.text}{" "}
          </span>
        );
      });
    }

    const widthCheck = isChecked ? "40%" : "70%";
    return (
      <Card style={{ width: widthCheck }}>
        {lineByLine && (
          <CardContent>
            {overallTone} <p>{lineByLine}</p>
          </CardContent>
        )}
        {!lineByLine && <p>Needs more input data.</p>}
      </Card>
    );
  };

  const displaySubData = () => {
    return (
      <Card width="40%" style={{ margin: 10 }}>
        <CardContent>
          <h3>Subjectivity: </h3>
          <p>{Math.floor(subData * 100)}%</p>
        </CardContent>
      </Card>
    );
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setTextToAnalyze(newValue);
  };

  const [type, setType] = useState("Text");

  const typeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div className="App">
      <h1>Tonus</h1>
      <div>
        Type
        <Select
          value={type}
          onChange={typeChange}
          style={{ margin: "1rem", width: "80px" }}
        >
          <MenuItem value="Text">Text</MenuItem>
          <MenuItem value="Audio">Audio</MenuItem>
        </Select>
        Online Article
        <Checkbox
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          color="primary"
        />
      </div>

      <TextField
        placeholder="Enter text to be analyzed here..."
        multiline
        rows={4}
        value={textToAnalyze}
        onChange={handleChange}
        variant="filled"
        style={{ width: "500px" }}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={loading}
        onClick={analyzeText}
        style={{ margin: "1rem" }}
      >
        Analyze
        {loading && <CircularProgress size={24} />}
      </Button>
      <div className="App">
        {toneData && displayToneData()}
        {isChecked && subData && displaySubData()}
      </div>
    </div>
  );
}

export default App;
