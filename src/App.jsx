import "./App.scss";
import arrow from "./assets/images/icon-arrow.svg";
import { useRef, useState, useEffect } from "react";

function App() {
  const dayRef = useRef();
  const monthRef = useRef();
  const yearRef = useRef();

  // const [days, setDays] = useState("--");
  // const [months, setMonths] = useState("--");
  // const [years, setYears] = useState("--");
  const [age, setAge] = useState({ years: "--", months: "--", days: "--" });
  const [counting, setCounting] = useState(false);

  const errorMessages = [
    "The field is required",
    "Must be a valid day",
    "Must be a valid month",
    "Must be in the past",
    "Must be a valid year",
    "Must be a valid date",
  ];

  function handleSubmit(e) {
    e.preventDefault();

    const dayValue = parseInt(dayRef.current.value, 10);
    const monthValue = parseInt(monthRef.current.value, 10);
    const yearValue = parseInt(yearRef.current.value, 10);

    //Global Variables
    let allGood;

    // ERROR HANDLING AND VALIDATIONS
    {
      // Decalarations
      const dayError = isNaN(dayValue) || dayValue < 1 || dayValue > 31;
      const monthError = isNaN(monthValue) || monthValue < 1 || monthValue > 12;
      const yearError =
        isNaN(yearValue) || yearValue < 1910 || yearValue > 2024;
      const Empty = isNaN(dayValue) && isNaN(yearValue) && isNaN(monthValue);
      const hasErrors = dayError || monthError || yearError;
      const invalidDate = dayValue > daysInMonth(monthValue, yearValue);
      allGood = !Empty && !hasErrors && !invalidDate;

      if (dayError || invalidDate) {
        if (invalidDate) {
          document.getElementById("day").innerText = errorMessages[5];
        } else if (dayError) {
          document.getElementById("day").innerText = isNaN(dayValue)
            ? errorMessages[0]
            : errorMessages[1];
        }
      } else {
        document.getElementById("day").innerText = "";
      }

      if (monthError) {
        document.getElementById("month").innerText = isNaN(monthValue)
          ? errorMessages[0]
          : errorMessages[2];
      } else {
        document.getElementById("month").innerText = "";
      }

      if (yearError) {
        if (yearValue > 2024) {
          document.getElementById("year").innerText = errorMessages[3];
        } else if (yearValue < 1910) {
          document.getElementById("year").innerText = errorMessages[4];
        } else if (isNaN(yearValue)) {
          document.getElementById("year").innerText = errorMessages[0];
        }
      } else {
        document.getElementById("year").innerText = "";
      }
      // Add error to element that turn red on error
      if (hasErrors || invalidDate) {
        const formatOnError = document.querySelectorAll(
          ".input__titles, .inputs"
        );
        formatOnError.forEach((element) => {
          element.classList.add("error");
        });
      } else {
        const formatOnError = document.querySelectorAll(
          ".input__titles, .inputs"
        );
        formatOnError.forEach((element) => {
          element.classList.remove("error");
        });
      }
    }
    // CAlCULATIONS
    if (allGood) {
      const birthdate = new Date(`${monthValue}/${dayValue}/${yearValue}`);
      const currentDate = new Date();
      const age = calculateAge(birthdate, currentDate);
      setCounting(true);
      setAge({ years: "--", months: "--", days: "--" });

      setTimeout(() => {
        setAge(age);
        setCounting(false);
      }, 500);
    }
  }

  useEffect(() => {
    if (counting) {
      const interval = setInterval(() => {
        setAge((prevAge) => ({
          years: prevAge.years === "--" ? 0 : prevAge.years + 1,
          months: prevAge.months === "--" ? 0 : prevAge.months + 1,
          days: prevAge.days === "--" ? 0 : prevAge.days + 1,
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [counting]);

  return (
    <>
      <main className="main">
        <h1 hidden> AGE CALCULATOR APP </h1>
        <form onSubmit={handleSubmit} className="date__form" noValidate>
          <div className="input__box">
            <h2 className="input__titles">DAY</h2>
            <input
              type="number"
              className="inputs"
              placeholder="DD"
              ref={dayRef}
            />
            <p className="error__message" id="day"></p>
          </div>
          <div className="input__box">
            <h2 className="input__titles">MONTH</h2>
            <input
              type="number"
              className="inputs"
              placeholder="MM"
              ref={monthRef}
            />
            <p className="error__message" id="month"></p>
          </div>
          <div className="input__box">
            <h2 className="input__titles">YEAR</h2>
            <input
              type="number"
              className="inputs"
              placeholder="YYYY"
              ref={yearRef}
            />
            <p className="error__message" id="year"></p>
          </div>
          <button type="submit" className="submit__btn">
            <img src={arrow} alt="" />
          </button>
        </form>
        <div className="result__container">
          <h2 className="result__figure">
            <strong className="counter">{age.years}</strong>years
          </h2>
          <h2 className="result__figure">
            <strong className="counter">{age.months}</strong>months
          </h2>
          <h2 className="result__figure">
            <strong className="counter">{age.days}</strong>days
          </h2>
        </div>
      </main>
    </>
  );
}
function calculateAge(birthdate, currentDate) {
  const diffInMilliseconds = currentDate - birthdate;

  const years = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

  const remainingMilliseconds =
    diffInMilliseconds % (365.25 * 24 * 60 * 60 * 1000);

  const months = Math.floor(
    remainingMilliseconds / (30.44 * 24 * 60 * 60 * 1000)
  );

  const remainingMillisecondsAfterMonths =
    remainingMilliseconds % (30.44 * 24 * 60 * 60 * 1000);

  const days = Math.floor(
    remainingMillisecondsAfterMonths / (24 * 60 * 60 * 1000)
  );

  return {
    years,
    months,
    days,
  };
}
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export default App;
