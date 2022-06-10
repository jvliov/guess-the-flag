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
    const randomNumber1 = Math.floor(Math.random() * response.data.length);
    const country1 = response.data[randomNumber1];
    const randomNumber2 = Math.floor(Math.random() * response.data.length);
    const country2 = response.data[randomNumber2];
    const randomNumber3 = Math.floor(Math.random() * response.data.length);
    const country3 = response.data[randomNumber3];
    const threeCountries = [country1, country2, country3];
    setOtherCountries(threeCountries);
    console.log(threeCountries);
    // getAnswerChoices();
    // const answerChoices = [country1.name.common, country2.name.common, country3.name.common, country.name.common];
    // const shuffledAnswerChoices = shuffle(answerChoices);
    // setAnswerChoices(shuffledAnswerChoices);
    // console.log(otherCountries[1]);
    // console.log(otherCountries[2]);
  }

  const getAnswerChoices = () => {
    const answerChoices = [otherCountries[0].name.common, otherCountries[1].name.common, otherCountries[2].name.common, country.name.common];
    const shuffledAnswerChoices = shuffle(answerChoices);
    const sortedAnswerChoices = shuffledAnswerChoices.sort();
    setAnswerChoices(sortedAnswerChoices);
    console.log(shuffledAnswerChoices); 
  }

  const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  const selectAnswer = (answer) => {
    if(answer === country.name.common) {
      alert('Correct!');
    } else {
      alert('Wrong!');
    }
    getCountry();
    getOtherCountries();
    console.log(answer);
  }

  useEffect(() => {
    getCountry(); 
    getOtherCountries();
  }, []);

  useEffect(() => {
    if(otherCountries === null) return;
    getAnswerChoices();
  }, [otherCountries]);

  // To ensure coutries are not the right answer
  // useEffect(() => {
  //   getOtherCountries();
  // }, [country]);

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
