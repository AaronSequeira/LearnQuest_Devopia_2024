import React, { useState, useEffect } from 'react';
import { quiz } from './questions';
import { useTimer } from 'react-timer-hook';
import './quiz.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loader } from '../assets';

const Quiz = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const [Quizz, setQuizz] = useState({
    topic: '',
    level: '',
    totalQuestions: null,
    perQuestionScore: null,
    questions: [
      {
        question: '',
        choices: ['', '', '', ''],
        type: 'MCQs',
        correctAnswer: '',
      },
    ]
  })

  const quiz_skel = {
    topic: '',
    level: '',
    totalQuestions: null,
    perQuestionScore: null,
    questions: [
      {
        question: '',
        choices: ['', '', '', ''],
        type: 'MCQs',
        correctAnswer: '',
      },
    ]
  };

  const syllabus = {
    Kindergarden: ['Introduction to numbers', 'Patterns and sequencing', 'Measurement', 'Logical reasoning and problem-solving'],
    
    '1': [
      'Number operations',
      'Place value',
      'Fractions',
      'Geometry',
      'Time and money',
      'Data handling'
    ],
  
    '2': [
      'Number operations',
      'Place value',
      'Fractions',
      'Geometry',
      'Time and money',
      'Data handling'
    ],
  
    '3': [
      'Number operations',
      'Place value',
      'Fractions',
      'Geometry',
      'Time and money',
      'Data handling'
    ],
  
    '4': [
      'Whole numbers',
      'Decimals',
      'Fractions',
      'Percentage',
      'Mensuration',
      'Symmetry',
      'Introduction to algebra'
    ],
  
    '5': [
      'Whole numbers',
      'Decimals',
      'Fractions',
      'Percentage',
      'Mensuration',
      'Symmetry',
      'Introduction to algebra'
    ],
  
    '6': [
      'Rational numbers',
      'Exponents and powers',
      'Linear equations in one variable',
      'Introduction to graphs',
      'Mensuration',
      'Pythagoras theorem',
      'Ratio and proportion',
      'Triangles',
      'Introduction to statistics'
    ],
  
    '7': [
      'Rational numbers',
      'Exponents and powers',
      'Linear equations in one variable',
      'Introduction to graphs',
      'Mensuration',
      'Pythagoras theorem',
      'Ratio and proportion',
      'Triangles',
      'Introduction to statistics'
    ],
  
    '8': [
      'Rational numbers',
      'Exponents and powers',
      'Linear equations in one variable',
      'Introduction to graphs',
      'Mensuration',
      'Pythagoras theorem',
      'Ratio and proportion',
      'Triangles',
      'Introduction to statistics'
    ],
  
    '9': [
      'Algebra',
      'Linear equations in two variables',
      'Quadratic equations',
      'Trigonometry',
      'Circles',
      'Coordinate geometry',
      'Mensuration',
      'Statistics'
    ],
  
    '10': [
      'Algebra',
      'Linear equations in two variables',
      'Quadratic equations',
      'Trigonometry',
      'Circles',
      'Coordinate geometry',
      'Mensuration',
      'Statistics'
    ],
  
    '11': [
      'Sets and relations',
      'Permutations and combinations',
      'Binomial theorem',
      'Matrices and determinants',
      'Calculus',
      'Coordinate geometry',
      'Vectors',
      'Probability',
      'Advanced statistics'
    ],
  
    '12': [
      'Sets and relations',
      'Permutations and combinations',
      'Binomial theorem',
      'Matrices and determinants',
      'Calculus',
      'Coordinate geometry',
      'Vectors',
      'Probability',
      'Advanced statistics'
    ]
  };

  const [notFinished , setNotFinished] = useState(true);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [marking,SetMarking] = useState([])

  const { questions } = Quizz;
  const { question, choices, correctAnswer } = questions[activeQuestion];

  useEffect(() =>{
    setIsLoading(true)
    axios.post('http://localhost:8000/gen', {syllabus: syllabus, quiz_skel: quiz_skel}, {withCredentials:true})
    .then((res) => {
      console.log(res.data.message)
      setQuizz({
        topic: 'Math',
        level: 'level',
        totalQuestions: 15,
        perQuestionScore: 1,
        questions: res.data.message
      })
      setIsLoading(false)
    })
    .catch((e)=>{console.log(e)})
  },[setShowResult])

  const onClickNext = () => {
    setSelectedAnswerIndex(null);
    const isCorrect = Math.random() < 0.5;
    console.log(isCorrect)
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
      axios.post('http://localhost:8000/ans-analysis', {questions: Quizz, wrong_ans: wrongQuestions}, {withCredentials: true})
      .then((res) => {
        console.log(res.data);
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
      {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}
      <div className={`quiz-container ${isLoading ? 'hidden': null } -ml-[200px]`}>
        {!isLoading ? !showResult ? (
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
        ): null}
      </div>
    </div>
  );
};

export default Quiz;
