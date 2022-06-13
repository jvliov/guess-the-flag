import { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  // const shuffle = (array) => {
  //   let currentIndex = array.length, temporaryValue, randomIndex;
  //   while (0 !== currentIndex) {
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex -= 1;
  //     temporaryValue = array[currentIndex];
  //     array[currentIndex] = array[randomIndex];
  //     array[randomIndex] = temporaryValue;
  //   }
  //   return array;
  // }

  const [country, setCountry] = useState();
  const [otherCountries, setOtherCountries] = useState(null);
  const [answerChoices, setAnswerChoices] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState(1);
  const allCountries = 'https://restcountries.com/v3.1/all';

  const getCountry = async () => {
    const response = await Axios.get(allCountries);
    const randomNumber = Math.floor(Math.random() * response.data.length);
    setCountry(response.data[randomNumber]);
    //console.log(response.data[randomNumber]);
  }

  const getOtherCountries = async () => {
    const response = await Axios.get(allCountries);
    const otherCountries = response.data.filter(currCountry => currCountry.name.common !== country.name.common);
    const shuffledAnswerChoices = otherCountries.sort(() => Math.random() - 0.5);
    setOtherCountries(shuffledAnswerChoices.slice(0, 3));
  }

  const getAnswerChoices = () => {
    const answerChoices = [otherCountries[0].name.common, otherCountries[1].name.common, otherCountries[2].name.common, country.name.common];
    const sortedAnswerChoices = answerChoices.sort();
    setAnswerChoices(sortedAnswerChoices);
  }

  const restart = () => {
    setPage(2);
    setCounter(1);
    setCorrectAnswers(0);
  }

  const selectAnswer = (answer) => {
    if (counter === 10) {
      setPage(3);
    }
    setCounter(counter + 1);
    if (answer === country.name.common) {
      setCorrectAnswers(correctAnswers + 1);
      alert('Correct!');
    } else {
      alert('Wrong! The correct answer is ' + country.name.common + '.');
    }
    getCountry();
  }

  useEffect(() => {
    getCountry();
    //getOtherCountries();
  }, []);

  useEffect(() => {
    if (otherCountries === null) return;
    getAnswerChoices();
  }, [otherCountries]);

  // To ensure coutries are not the right answer
  useEffect(() => {
    if (country === null) return;
    getOtherCountries();
  }, [country]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {(() => {
            switch (page) {
              case 1:
                return (
                  <div>
                    <h1>Guess The Flag</h1>
                    <button onClick={() => setPage(2)}>Start</button>
                  </div>
                )
              case 2:
                return (
                  <div>
                    {
                      country !== undefined ?
                        <div key={country}>
                          <h1>What is this country?</h1>
                          {/* <p>{country.name.common}</p> */}
                          <p>Flag: {counter}/10</p>
                          <p>Capital: {country.capital}</p>
                          <p>Population: {country.population}</p>
                          {/* <p>Languages: {country.languages.map(language => language.name).join(', ')}</p> */}
                          <img src={country.flags.svg} alt={country.name.common} />
                        </div>
                        : null
                    }
                    {
                      answerChoices.length > 0 ?
                        <div>
                          {answerChoices !== undefined ?
                            <div>
                              <button onClick={() => selectAnswer(answerChoices[0])}> {answerChoices[0]} </button>
                              <button onClick={() => selectAnswer(answerChoices[1])}> {answerChoices[1]} </button>
                              <button onClick={() => selectAnswer(answerChoices[2])}> {answerChoices[2]} </button>
                              <button onClick={() => selectAnswer(answerChoices[3])}> {answerChoices[3]} </button>
                            </div>
                            : null}
                        </div>
                        : null
                    }
                  </div>
                )
              case 3:
                return (
                  <div>
                    <h1>Final Score</h1>
                    <p>You got {correctAnswers}/10 correct!</p>
                    <button onClick={() => restart()}>Play Again</button>
                    <button onClick={() => setPage(1)}>Home</button>
                  </div>
                )
            }
          })()}

        </div>
      </header>
    </div>
  );
}

export default App;
