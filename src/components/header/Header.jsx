import "./header.css"
import { useContext, useState} from "react";
import {useNavigate} from "react-router-dom"
import { FaBed, FaCalendarDay, FaCar, FaPlane, FaTaxi } from 'react-icons/fa';
import {GiPerson} from "react-icons/gi"
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment'
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

const Header = ({type}) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult : 1,
    children : 0,
    room : 1,
  })

  //this hook for redirect to any page
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleOption = (name, operation) =>{
    setOptions(prev=>{ return{
      ...prev, [name] : operation === 'i' ? options[name] + 1 : options[name] - 1
    }

    })
  }

  const {dispatch} = useContext(SearchContext)

  const handleSearch = ()=>{
    dispatch({type: "NEW_SEARCH", payload: {destination, dates, options}});
     navigate("/hotels", {state: {destination, dates, options}});
  }


  return (
    <div className="header">
      <div className={type ==="list" ? "headerContainer listMode": "headerContainer"}>
        <div className="headerList">
          <div className="headerListItem active">
            <FaBed/>
            <span>Stays</span>
          </div>

            <div className="headerListItem">
            <FaPlane/>
            <span>Flights</span>
            </div>

            <div className="headerListItem">
            <FaCar/>
            <span>Car rentals</span>
            </div>

            <div className="headerListItem">
            <FaBed/>
            <span>Attractions</span>
            </div>

            <div className="headerListItem">
            <FaTaxi/>
            <span>Taxi</span>
            </div>
          </div>

        { type !== "list" &&  
        <>
         <h1 className="headerTitle">A lifetime of discounts? It's Genius</h1>
          <p className="headerDesc">
            Get rewarded form your travels unlock instant saving of 10% or more with
            a free Lamabooking acount.
          </p>
           {!user && <button className="headerBtn">Sign in/ Register</button> }
          <div className="headerSearch">
            <div className="headerSearchItem">
              <FaBed className="headerIcon"/>
              <input 
              type="text" 
              placeholder="Where are you going?" 
              className="headerSearchInput"
              onChange={e=>setDestination(e.target.value)}/>
            </div>

            <div className="headerSearchItem">
              <FaCalendarDay className="headerIcon"/>
              <span onClick={()=>setOpenDate(!openDate)} className="headerSearchText">
              {`${moment(dates[0].startDate).format("dd/MM/yyyy")} to ${moment(dates[0].endDate).format('dd/MM/yyyy')}`}
                </span>
             { openDate  && <DateRange
              editableDateInputs={true}
              onChange={item => setDates([item.selection])}
              ranges={dates}
              moveRangeOnFirstSelection={false}
              className="date"
              minDate={new Date()}
              />}
            </div>
                  
            <div className="headerSearchItem">
              <GiPerson className="headerIcon"/>
              <span onClick={()=>setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult - ${options.children} children - ${options.room} room`}</span>
             {openOptions && <div className="options">
                <div className="optionsItem">
                  <span className="optionText">Adult</span>
                   <div className="optionCounter">
                     <button
                     disabled={options.adult <= 1}
                     className="optionCounterButton" onClick={()=>handleOption("adult", "d")}>-</button>
                     <span className="optionCounterNumber">{options.adult}</span>
                     <button className="optionCounterButton" onClick={()=>handleOption("adult", "i")}>+</button>
                   </div>
                  
                </div>
                <div className="optionsItem">
                  <span className="optionText">Children</span>
                  <div className="optionCounter">
                     <button
                     disabled={options.children <= 0}
                     className="optionCounterButton" onClick={()=>handleOption("children", "d")}>-</button>
                    <span className="optionCounterNumber">{options.children}</span>
                    <button className="optionCounterButton" onClick={()=>handleOption("children", "i")}>+</button>
                  </div>
                </div>
                <div className="optionsItem">
                  <span className="optionText">Room</span>
                  <div className="optionCounter">
                  <button 
                  disabled = {options.room <= 1}
                  className="optionCounterButton" onClick={()=>handleOption("room", "d")}>-</button>
                    <span className="optionCounterNumber">{options.room}</span>
                  <button className="optionCounterButton" onClick={()=>handleOption("room", "i")}>+</button>
                  </div>
                </div>
              </div> }
            </div>
             
            <div className="headerSearchItem">
              <button className="headerBtn" onClick={handleSearch}>search</button>
            </div>
       
          </div>
         </>
         }
        </div>
    </div>
  )
}

export default Header