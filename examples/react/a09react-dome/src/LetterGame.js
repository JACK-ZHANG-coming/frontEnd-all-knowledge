import React, { useState, useEffect } from 'react';

const lettersConsonants = 'BCDFGHJKLMNPQRSTVWXYZ';

const LetterGame = () => {
  const [taskType, setTaskType] = useState({
    backTask1: 1,
    backTask2: 2,
    backTask0: 0
  });
  const [currentTask, setCurrentTask] = useState(2);
  const [letters, setLetters] = useState([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentLetter, setCurrentLetter] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showRestScreen, setShowRestScreen] = useState(false);
  const [showCountdownToNextGame, setShowCountdownToNextGame] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [countdownProgress, setCountdownProgress] = useState(100);
  const [targetLetter, setTargetLetter] = useState('');
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [countdownInterval, setCountdownInterval] = useState(null);

  useEffect(() => {
    // Handle keydown event
    const handleKeyPress = (event) => {
      if (event.key === ' ' && !isKeyPressed) {
        setIsKeyPressed(true);
      }
    };

    // Add event listener on mount
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(intervalId);
      clearInterval(countdownInterval);
    };
  }, [isKeyPressed, intervalId, countdownInterval]);

  const generateLettersForBackTask1 = () => {
    const totalLetters = 48;
    const sameLetterCount = 15;
    let result = [];
    let sameCount = 0;

    for (let i = 0; i < totalLetters; i++) {
      if (sameCount < sameLetterCount && Math.random() < 0.33) {
        if (i > 0) {
          result.push(result[i - 1]);
          sameCount++;
        } else {
          result.push(lettersConsonants.charAt(Math.floor(Math.random() * lettersConsonants.length)));
        }
      } else {
        let newLetter;
        do {
          newLetter = lettersConsonants.charAt(Math.floor(Math.random() * lettersConsonants.length));
        } while (i > 0 && newLetter === result[i - 1]);
        result.push(newLetter);
      }
    }
    setLetters(result);
  };

  const generateLettersForBackTask2 = () => {
    const totalLetters = 48;
    const sameLetterCount = 15;
    let result = [];
    let sameCount = 0;
    let duplicatePositions = [];

    while (duplicatePositions.length < sameLetterCount) {
      let randomPos = Math.floor(Math.random() * (totalLetters - 2)) + 2;
      if (!duplicatePositions.includes(randomPos)) {
        duplicatePositions.push(randomPos);
      }
    }

    for (let i = 0; i < totalLetters; i++) {
      let newLetter;
      if (duplicatePositions.includes(i) && i > 1) {
        newLetter = result[i - 2];
        sameCount++;
      } else {
        do {
          newLetter = lettersConsonants.charAt(Math.floor(Math.random() * lettersConsonants.length));
        } while (i > 1 && (newLetter === result[i - 1] || newLetter === result[i - 2]));
      }
      result.push(newLetter);
    }
    setLetters(result);
  };

  const generateLettersForBackTask0 = (targetLetter) => {
    const consonants = lettersConsonants.replace(targetLetter, '');
    const totalLetters = 48;
    const targetLetterCount = 15;
    let result = [];

    for (let i = 0; i < totalLetters; i++) {
      if (i < targetLetterCount || Math.random() < 0.3125) {
        result.push(targetLetter);
      } else {
        result.push(consonants.charAt(Math.floor(Math.random() * consonants.length)));
      }
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    setLetters(result);
  };

  const startGame = (task) => {
    if (isGameRunning) return;

    setShowCountdownToNextGame(false);
    setShowRestScreen(false);
    setCurrentTask(task);
    setIsGameRunning(true);
    setCurrentLetterIndex(0);
    setCorrectCount(0);

    if (task === taskType.backTask1) {
      setLetters(['V', 'V', 'X', 'X', 'V', 'X', 'X', 'V']);
    } else if (task === taskType.backTask2) {
      generateLettersForBackTask2();
    } else if (task === taskType.backTask0) {
      setTargetLetter('X');
      generateLettersForBackTask0('X');
    }

    showNextLetter();
  };

  const showNextLetter = () => {
    if (currentLetterIndex >= letters.length) {
      clearInterval(intervalId);
      setIsGameRunning(false);
      setShowProgressBar(false);
      if (currentTask === taskType.backTask1 || currentTask === taskType.backTask2) {
        setShowRestScreen(true);
      }
      return;
    }

    setCurrentLetter(letters[currentLetterIndex]);
    setCurrentLetterIndex(currentLetterIndex + 1);

    setTimeout(() => {
      setCurrentLetter('');
      setTimeout(() => {
        autoJudge();
      }, 1000);
    }, 1000);
  };

  const autoJudge = () => {
    const currentIndex = currentLetterIndex - 1;
    judgeLetter(currentIndex, isKeyPressed);
    setShowFeedback(true);

    setTimeout(() => {
      showNextLetter();
    }, 500);
  };

  const judgeLetter = (currentIndex, isKeyPressed) => {
    if (currentTask === taskType.backTask1) {
      if (currentIndex === 0 && !isKeyPressed) {
        setIsCorrect(true);
      } else {
        setIsCorrect(isKeyPressed ? letters[currentIndex] === letters[currentIndex - 1] : letters[currentIndex] !== letters[currentIndex - 1]);
      }
    } else if (currentTask === taskType.backTask2) {
      if (currentIndex === 0 || currentIndex === 1) {
        setIsCorrect(!isKeyPressed);
      } else {
        setIsCorrect(isKeyPressed ? letters[currentIndex] === letters[currentIndex - 2] : letters[currentIndex] !== letters[currentIndex - 2]);
      }
    } else if (currentTask === taskType.backTask0) {
      setIsCorrect(isKeyPressed ? letters[currentIndex] === targetLetter : letters[currentIndex] !== targetLetter);
    }

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
  };

  const startCountdown = () => {
    setCountdownProgress(100);
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
        setCountdownProgress((countdown / 60) * 100);
      } else {
        clearInterval(interval);
        setCountdownProgress(0);
      }
    }, 1000);
  };

  return (
    <div id="app">
      {currentTask === taskType.backTask1 || currentTask === taskType.backTask2 ? (
        !showCountdownToNextGame && !showRestScreen && (
          <div>
            <div>Correct Count: {correctCount}</div>
            <button onClick={() => startGame(taskType.backTask2)} disabled={isGameRunning}>开始</button>
            <div className="letter-container">
              <div style={{ height: '450px' }}>
                <h1 style={{ textAlign: 'center' }}>{currentTask}-Back Task</h1>
                <div className="letter"><span>{currentLetter}</span></div>
              </div>
              <div className="feedback-container">
                <div style={{ width: '100%', height: '20px' }}>
                  {showProgressBar && (
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${progressBarWidth}%` }}></div>
                    </div>
                  )}
                </div>
                {showFeedback && (
                  <div className="feedback">
                    {isCorrect ? (
                      <img src="/img/成功.svg" className="correct" alt="Correct" />
                    ) : (
                      <img src="/img/失败.svg" className="incorrect" alt="Incorrect" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      ) : null}

      {(!isGameRunning && showRestScreen && !showCountdownToNextGame) && (
        <div className="next-button-container">
          <p style={{ textAlign: 'center' }}>Finished！</p>
          <button onClick={() => { setShowCountdownToNextGame(true); startCountdown(); }}>Next</button>
        </div>
      )}

      {!isGameRunning && showCountdownToNextGame && (
        <div className="next-button-container">
          <p style={{ textAlign: 'center' }}>Break Task</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${countdownProgress}%` }}></div>
          </div>
          <button onClick={() => startGame(taskType.backTask0)} disabled={countdown > 0}>Next</button>
        </div>
      )}

      {currentTask === taskType.backTask0 && (
        <div>
          <div>Correct Count: {correctCount}</div>
          <button onClick={() => startGame(taskType.backTask0)} disabled={isGameRunning}>开始</button>
          <div className="letter-container">
            <div style={{ height: '200px' }}>
              <h1 style={{ textAlign: 'center' }}>0-Back Task targetLetter: {targetLetter}</h1>
              <div className="letter"><span>{currentLetter}</span></div>
            </div>
            <div className="feedback-container">
              <div style={{ width: '100%', height: '20px' }}>
                {showProgressBar && (
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressBarWidth}%` }}></div>
                  </div>
                )}
              </div>
              {showFeedback && (
                <div className="feedback">
                  {isCorrect ? (
                    <img src="/img/成功.svg" className="correct" alt="Correct" />
                  ) : (
                    <img src="/img/失败.svg" className="incorrect" alt="Incorrect" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterGame;
