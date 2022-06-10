import { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {

  const [country, setCountry] = useState();
  const [otherCountries, setOtherCountries] = useState(null);
  const [answerChoices, setAnswerChoices] = useState([]);
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

  const selectAnswer = (answer) => {
    if(answer === country.name.common) {
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
    if(otherCountries === null) return;
    getAnswerChoices();
  }, [otherCountries]);

  // To ensure coutries are not the right answer
  useEffect(() => {
    if(country === null) return;
    getOtherCountries();
  }, [country]);

  return (
    <div className="App">
      <header className="App-header">
        {country !== undefined ? 
          <div key={country}>
            <h1>What is this country?</h1>
            {/* <p>{country.name.common}</p> */}
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population}</p>
            {/* <p>Languages: {country.languages.map(language => language.name).join(', ')}</p> */}
            <img src={country.flags.svg} alt={country.name.common} />
          </div>
        : null}
        {answerChoices.length > 0 ?
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
        : null}
      </header>
    </div>
  );
}

export default App;
