import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import logo from "./logo.png";

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
      console.log(response.data);
      setSubData(response.data);
    }
    setLoading(false);
  };

  const getColor = (tone) => {
    switch (tone.tone_id) {
      case "analytical":
        return "green";
      case "tentative":
        return "red";
      case "joy":
        return "orange";
      case "sadness":
        return "purple";
      case "confident":
        return "blue";
      default:
        return "black";
    }
  };

  const displayToneData = () => {
    console.log(toneData.document_tone.tones);

    const colorLegend = (
      <div>
        <div className="wrapper">
          <div className={getColor({ tone_id: "analytical" })}></div>
          <p>Analytical</p>
        </div>
        <div className="wrapper">
          <div className={getColor({ tone_id: "tentative" })}></div>
          <p>Tentative</p>
        </div>
        <div className="wrapper">
          <div className={getColor({ tone_id: "joy" })}></div>
          <p>Joy</p>
        </div>
        <div className="wrapper">
          <div className={getColor({ tone_id: "sadness" })}></div>
          <p>Sadness</p>
        </div>
        <div className="wrapper">
          <div className={getColor({ tone_id: "confident" })}></div>
          <p>Confident</p>
        </div>
      </div>
    );

    const overallTone = toneData.document_tone.tones.map((tone) => (
      <div className="wrapper">
        <div className={getColor(tone)}></div>
        <h3>
          {tone.tone_name} - {Math.floor(tone.score * 100)}%
        </h3>
      </div>
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

    return (
      <Card style={{ width: "85%", margin: "1rem" }}>
        {lineByLine && (
          <CardContent>
            {overallTone} {colorLegend} <p>{lineByLine}</p>
          </CardContent>
        )}
        {!lineByLine && <p>Needs more input data.</p>}
      </Card>
    );
  };

  const displaySubData = () => {
    return (
      <Card width="70%" style={{ margin: 10 }}>
        <CardContent>
          <h3>
            Overall Subjectivity: {Math.floor(subData.subjectivity * 100)}%
          </h3>
          {subData.sentence_subjectivity.map((sentence, index) => {
            return (
              <p key={index}>
                {Math.floor(sentence.subjectivity * 100)}% : {sentence.sentence}
              </p>
            );
          })}
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
      <img src={logo} />
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
        rows={8}
        value={textToAnalyze}
        onChange={handleChange}
        variant="filled"
        style={{ width: "85%" }}
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

      <div className="card">
        {toneData && displayToneData()}
        {isChecked && subData && displaySubData()}
      </div>
    </div>
  );
}

export default App;
