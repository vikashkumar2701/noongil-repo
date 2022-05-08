import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useSpeechSynthesis } from "react-speech-kit";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

import "./App.css";
var axios = require("axios");
const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";
const appId = "";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);

SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);
function App() {
  const [video, setVideo] = useState(0);

  const commands = [
    {
      command: ["* label *", "* labeling *"],
      callback: () => {
        dd(startLabel);
        resetTranscript();
      }
    },
    {
      command: "* object *",
      callback: () => {
        console.log("Detection of object");

        dd(detectObject);
        resetTranscript();
      }
    },
    {
      command: "* read *",
      callback: () => {
        dd(readText);
        resetTranscript();
      }
    },
    {
      command: "* logo *",
      callback: () => {
        dd(logo);
        resetTranscript();
      }
    },
    {
      command: "* landmark *",
      callback: () => {
        dd(detlandmark);
        resetTranscript();
      }
    }
  ];

  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands
  });
  const { speak } = useSpeechSynthesis();

  var data = "";

  function dd(callback) {
    capture();
    Loading.standard();
    setTimeout(() => {
      callback();
    }, 5000);
  }

  function detectObject() {
    var objectaws = {
      method: "get",
      url: "",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
      },
      data: data
    };
    console.log(speak);
    speak({ text: "I'am processing your data. Please wait." });
    axios(objectaws)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const speaking = response.data;
        speaking.forEach((voice) => {
          setTimeout(() => {
            speak({ text: voice });
          }, 1000);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    Loading.remove();
  }

  function readText() {
    var imageRead = {
      method: "get",
      url: "",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
      },
      data: data
    };
    speak({ text: "Processing your request. Please wait." });
    axios(imageRead)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const speaking = response.data;
        speak({ text: speaking });
      })

      .catch(function (error) {
        console.log(error);
      });
    Loading.remove();
  }

  function startLabel() {
    var config = {
      method: "get",
      url: "",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const speaking = response.data;
        speaking.forEach((voice) => {
          setTimeout(() => {
            speak({ text: voice });
          }, 1000);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    Loading.remove();
  }

  function logo() {
    var config = {
      method: "get",
      url: "",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
      },
      data: data
    };

    speak({ text: "Processing yout request. Please wait." });
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const speaking = response.data;
        speak({ text: speaking });
      })
      .catch(function (error) {
        console.log(error);
      });
    Loading.remove();
  }

  function detlandmark() {
    var config = {
      method: "get",
      url: "",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
      },
      data: data
    };

    speak({ text: "Processing your request. Please wait." });
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const speaking = response.data;
        speak({ text: speaking });
        console.log(speaking);
        // speaking.forEach((voice) => {
        //   setTimeout(() => {
        //     speak({ text: voice });
        //   }, 1000);
        // });
      })
      .catch(function (error) {
        console.log(error);
      });
    Loading.remove();
  }

  const [img, setimg] = useState();
  const webcamRef = React.useRef(null);
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setimg(imageSrc);
    //console.log(imageSrc);
  }, [webcamRef]);

  const handleClick = React.useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  useEffect(() => {
    setInterval(() => {
      setVideo(1);
    }, 2000);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    var data = JSON.stringify({
      baseimage: img
    });

    //console.log(data);
    var config = {
      method: "post",
      url: "",

      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0"
      },

      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [img]);

  useEffect(() => {
    console.log(transcript);
  }, [transcript]);
  const videoConstraints = {
    facingMode: facingMode
  };
  return (
    <div className="App">
      <nav>
        <div>NoonGil</div>
        <div>
          {listening ? (
            <>
              <FontAwesomeIcon
                icon={faMicrophone}
                size="2sm"
                className="microphone"
              />
              <span>&nbsp;Listening...</span>
            </>
          ) : (
            "off"
          )}
        </div>
      </nav>

      <div className="col">
        <div className="row">
          {video === 1 ? (
            <Webcam
              className="webcam"
              audio={false}
              ref={webcamRef}
              height={720}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
            >
              {({ getScreenshot }) => (
                <>
                  <div className="buttongroup">
                    <button onClick={capture}>Capture photo</button>
                    <button onClick={handleClick}>Switch camera</button>
                  </div>
                  <p>{transcript}</p>
                </>
              )}
            </Webcam>
          ) : (
            ""
          )}
        </div>
        <div className="row">
          <div className="outputimagegroup">
            {img != null ? (
              <img src={img} className="outputimage" alt="outputimage" />
            ) : (
              ""
            )}
            <div className="buttongroup">
              <p>Microphone: </p>
              <button onClick={SpeechRecognition.startListening}>Start</button>
              <button onClick={resetTranscript}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
