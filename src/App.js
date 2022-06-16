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

  const regions = [
    { label: 'All Flags', value: 'ALL' },
    { label: 'Europe', value: 'EU' },
    { label: 'North & Central America', value: 'NA' },
    { label: 'South America', value: 'SA' },
    { label: 'Africa', value: 'AF' },
    { label: 'Asia', value: 'AS' }
  ];

  const [country, setCountry] = useState(null);
  const [otherCountries, setOtherCountries] = useState(null);
  const [answerChoices, setAnswerChoices] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState(1);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [region, setRegion] = useState('ALL');

  const allCountries = 'https://restcountries.com/v3.1/all';
  const europeCountries = 'https://restcountries.com/v3.1/region/europe';
  const northAmericaCountries = 'https://restcountries.com/v3.1/subregion/North%20America';
  const centralAmericaCountries = 'https://restcountries.com/v3.1/subregion/Central%20America';
  const southAmericaCountries = 'https://restcountries.com/v3.1/subregion/South%20America';
  const africaCountries = 'https://restcountries.com/v3.1/region/africa';
  const asiaCountries = 'https://restcountries.com/v3.1/region/asia';

  const getCountry = async () => {
    // switch(region) {
    //   case 'ALL':
    //     const response = await Axios.get(allCountries);
    //     break;
    //   case 'EU':
    const url = region === 'ALL' ? allCountries : region === 'EU' ? europeCountries : region === 'NA' ? northAmericaCountries : region === 'SA' ? southAmericaCountries : region === 'AF' ? africaCountries : asiaCountries;
    const response = await Axios.get(url);
    let countries = response.data;
    let length = countries.length;
    if(region === 'NA') {
      const centralResponse = await Axios.get(centralAmericaCountries);
      countries = [...countries, ...centralResponse.data];
      length = countries.length;
    }
    const randomNumber = Math.floor(Math.random() * countries.length);
    setCountry(countries[randomNumber]);
    // console.log(countries);
  }

  const getOtherCountries = async () => {
    const url = region === 'ALL' ? allCountries : region === 'EU' ? europeCountries : region === 'NA' ? northAmericaCountries : region === 'SA' ? southAmericaCountries : region === 'AF' ? africaCountries : asiaCountries;
    const response = await Axios.get(url);
    let countries = response.data;
    let length = countries.length;
    if(region === 'NA') {
      const centralResponse = await Axios.get(centralAmericaCountries);
      countries = [...countries, ...centralResponse.data];
      length = countries.length;
    }
    const otherCountries = countries.filter(currCountry => currCountry.name.common !== country.name.common);
    const shuffledAnswerChoices = otherCountries.sort(() => Math.random() - 0.5);
    setOtherCountries(shuffledAnswerChoices.slice(0, 3));
    // console.log(response.data);
  }

  const getAnswerChoices = () => {
    const answerChoices = [otherCountries[0].name.common, otherCountries[1].name.common, otherCountries[2].name.common, country.name.common];
    const sortedAnswerChoices = answerChoices.sort();
    setAnswerChoices(sortedAnswerChoices);
  }

  const newGame = () => {
    getCountry();
    setPage(2);
    setCounter(1);
    setCorrectAnswers(0);
    setTime(0);
    setRunning(true);
  }

  const selectAnswer = (answer) => {
    if (counter === 10) {
      setRunning(false);
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

  // useEffect(() => {
  //   getCountry();
  //   //getOtherCountries();
  // }, []);

  useEffect(() => {
    if (otherCountries === null) return;
    getAnswerChoices();
  }, [otherCountries]);

  // To ensure coutries are not the right answer
  useEffect(() => {
    if (country === null) return;
    getOtherCountries();
  }, [country]);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

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
                    <div className="region-selector">
                      <label>
                        Select a region
                        <select value={region} onChange={(e) => { setRegion(e.target.value); }}>
                          {regions.map((region) => {
                            return (
                              <option value={region.value}>{region.label}</option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                    <button onClick={() => newGame()}>Start</button>
                  </div>
                )
              case 2:
                return (
                  <div>
                    {
                      country !== null ?
                        <div key={country}>
                          <h1>What is this flag?</h1>
                          {/* <p>{country.name.common}</p> */}
                          <div className='numbers'>
                            <span>Time: {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                            <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                          </div>
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
                    <p>You got {correctAnswers}/10 correct in
                      <span> {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                      <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                      !</p>
                    <button onClick={() => newGame()}>Play Again</button>
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
