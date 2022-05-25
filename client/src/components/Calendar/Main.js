import React, { useEffect, useState, useSyncExternalStore } from "react";
import "./Main.css";
import InputForm from "./InputForm";
import axios from "axios";

function Main() {
  let datee = new Date();
  let [date, setDate] = useState(datee);
  let [dateArray, setDateArray] = useState([]);
  let viewYear = date.getFullYear();
  let viewMonth = date.getMonth();

  const [isAuth, setIsAuth] = useState(false);

  //const [viewYear, setViewYear] = useState(date.getFullYear());
  //const [viewMonth, setViewMonth] = useState(date.getMonth());

  const renderCalendar = () => {
    console.log("renderCalendar 함수 실행");
    viewYear = date.getFullYear(); //현재 시간 기준 연도
    console.log(`함수 내 viewYear = ${viewYear}`);
    //setViewYear(viewYear);
    viewMonth = date.getMonth(); //함수 내 viewMonth
    console.log(
      `함수 내 viewMonth = ${viewMonth}, 현재 시간 기준 달 = ${viewMonth + 1}`
    );
    //setViewMonth(viewMonth);

    //현재 시간 기준 페이지에서 위 아래에 보일 저번, 다음 달의 날짜들
    const prevLast = new Date(viewYear, viewMonth, 0); //저번달의 마지막 날짜 객체
    const thisLast = new Date(viewYear, viewMonth + 1, 0); //이번달의 마지막 날짜 객체

    const PLDate = prevLast.getDate(); //저번달 마지막 날짜
    const PLDay = prevLast.getDay(); //저번 요일

    const TLDate = thisLast.getDate(); //이번달 마지막 날짜
    const TLDay = thisLast.getDay(); //이번달 마지막 요일

    const prevDates = []; //저번달 날짜, 그릴수도 있고 안그릴수도 있어서 초기값은 빈배열
    const thisDates = [...Array(TLDate + 1).keys()].slice(1); //slice(1)은 제일 앞에 원소 제거, 1~TLDate 까지의 배열(현재는 모두 undefined)
    const nextDates = []; //이번달 날짜, 그릴수도 잇고 안그릴수도 있어서 초기값은 빈배열

    //기준페이지에 들어갈 저번달 날짜
    if (PLDay !== 6) {
      //저번달 마지막 요일이 토요일(6)이면 굳이 그릴 필요 없음 => 달력이 이번달 일요일(0) 1일부터 시작함
      for (let i = 0; i < PLDay + 1; i++) {
        prevDates.unshift(PLDate - i);
        //ex) PLDay 가 일요일(0)이면 일요일 날짜만 들어가고,
        //ex) PLDay가 수요일(3)이면 일,월,화,수 날짜가 들어간다.
      }
    }
    //기준페이지에 들어갈 다음달 날짜
    for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i);
      //ex) TLDay가 토요일(6)이면 다음달 날짜가 표시될 일이 없음
      //ex) TLDay가 화요일(2)이면 수,목,금,토 날짜가 들어간다.
    }
    //세 배열을 prevDates에 합친다.(prev->this->next 순)
    let dates = prevDates.concat(thisDates, nextDates);
    setDateArray(dates);
    console.log(`함수 내 dates = ${dates}`);
  };

  useEffect(() => {
    async function fetchData() {
      await axios.get("/api/users/auth").then((res) => {
        if (res.data.isAuth) {
          setIsAuth(true);
          console.log("isAuth is true");
        } else {
          console.log("isAuth is false");
        }
      });
    }
    fetchData();

    renderCalendar();
  }, []);

  const onLastMonthHandler = (e) => {
    e.preventDefault();
    date.setMonth(date.getMonth() - 1);
    console.log(date);
    setDate(date);
    renderCalendar(date);
    console.log("이동완료");
  };
  const onNextMonthHandler = (e) => {
    e.preventDefault();
    date.setMonth(date.getMonth() + 1);
    console.log(date);
    setDate(date);
    renderCalendar(date);
    console.log("이동완료");
  };

  return (
    <div className="calendar">
      <div className="header">
        <div className="year-month">
          {viewYear}년 {viewMonth + 1}월
        </div>
        <div className="nav">
          <button className="nav-button" onClick={onLastMonthHandler}>
            Prev
          </button>
          <button className="nav-button">Today</button>
          <button className="nav-button" onClick={onNextMonthHandler}>
            Next
          </button>
        </div>
      </div>
      <div className="inputForm">
        {isAuth && <InputForm />}
      </div>
      <div className="days">
        <div className="day">일</div>
        <div className="day">월</div>
        <div className="day">화</div>
        <div className="day">수</div>
        <div className="day">목</div>
        <div className="day">금</div>
        <div className="day">토</div>
      </div>
      <div className="dates">
        {dateArray &&
          dateArray.map((date, index) => {
            return <div className="date">{date}</div>;
          })}
      </div>
    </div>
  );
}
export default Main;