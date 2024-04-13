import React, { useState } from 'react';
import { quiz } from './questions';
import { useTimer } from 'react-timer-hook';
import './quiz.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Quiz = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [notFinished , setNotFinished] = useState(true);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [marking,SetMarking] = useState([])

  const { questions } = quiz;
  const { question, choices, correctAnswer } = questions[activeQuestion];

  const onClickNext = () => {
    setSelectedAnswerIndex(null);
    const isCorrect = selectedAnswer === correctAnswer;
    setResult((prev) => ({
      ...prev,
      score: prev.score + (isCorrect ? 5 : 0),
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
    }));
    if (!isCorrect) {
      setWrongQuestions((prev) => [...prev, activeQuestion]);
    }
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
      setNotFinished(false);
      axios.post('http://localhost:8000/addPoints', {points: result.correctAnswers * 20}, {withCredentials: true})
      .then((res) => {
        console.log('Added: '+ (result.correctAnswers * 20));
        toast.success(res.data.message);
      })
      .catch((e) => {
        toast.error("Error : " + e);
      });
    }
  };

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index);
    setSelectedAnswer(answer);
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  return (
    <div className="flex justify-center">
      <h1 className="font-epilogue font-semibold font-['Ubuntu'] text-xl pb-4 md:text-4xl text-white text-center md:text-left">Daily Quiz</h1>
      <div className="quiz-container -ml-[200px]">
        {!showResult ? (
          <div>
            <div>
              <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
              <span className="total-question">/{addLeadingZero(questions.length)}</span>
            </div>
            <h2>{question}</h2>
            <ul>
              {choices.map((answer, index) => (
                <li
                  onClick={() => onAnswerSelected(answer, index)}
                  key={answer}
                  className={selectedAnswerIndex === index ? 'selected-answer' : null}
                >
                  {answer}
                </li>
              ))}
            </ul>
            <div className="flex-right">
              <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
                {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        ) : (
          <div className="result">
            <h3>Result</h3>
            <p>Total Question: <span>{questions.length}</span></p>
            <p>Total Score:<span> {result.score}</span></p>
            <p>Correct Answers:<span> {result.correctAnswers}</span></p>
            <p>Wrong Answers:<span> {result.wrongAnswers}</span></p>
            <p>Points Earned:<span> {result.correctAnswers * 20}</span></p>
            <button>View Results</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
