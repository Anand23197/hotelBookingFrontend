import React from 'react'
import "./reserve.css"
import {MdDangerous} from "react-icons/md"
import useFetch from '../../hooks/useFetch'
import { useState, useContext } from 'react'
import {SearchContext} from "../../context/SearchContext"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { DATA_API } from '../../utils/ApiRoutes'

const Reserve = ({setOpen, hotelId}) => {
    const [selectedRooms, setSelectedRooms] = useState([])
    const {data, loading, error} = useFetch(`/hotels/room/${hotelId}`);
    const {dates} = useContext(SearchContext);
  
    const getDatesInRange = (startDate, endDate) =>{
        const start = new Date(startDate)
        const end = new Date(endDate)
        const date = new Date(start.getTime());
      let list = [];
      while(date <= end){
        list.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
      }
      return list;
    }
    
    const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);
    
    const isAvailable = (roomNumber)=>{
      const isFound = roomNumber.unavailableDates.some(date=>{
       return alldates.includes(new Date(date).getTime())
      })

      return !isFound
    }
 
    console.log(alldates);
    const handleSelect = (e) =>{
         const checked = e.target.checked;
         const value = e.target.value;
         setSelectedRooms(checked ? [...selectedRooms, value] 
            : selectedRooms.filter((item)=>item !== value))
    }

    const navigate = useNavigate();

    const handleClick = async ()=>{
           try{
             await Promise.all(
               selectedRooms.map(roomId=>{
                 const res = axios.put(`${DATA_API}/rooms/availability/${roomId}`, {
                dates : alldates,
              })
              return res.data;
             })
             );
             setOpen(false);
             navigate("/");
           }catch(err){

           }
    }

  return (
    <div className='reserve'>
        <div className="rContainer">
            <MdDangerous
            className='rClose'
            onClick={()=> setOpen(false)}
            />
            <span>Select your rooms:</span>
            {data.map(item=>{
                
                return(
                <div className="rItem">
                    <div className="rItemInfo">
                        <div className="rTitle">{item.title}</div>
                        <div className="rDesc">{item.desc}</div>
                        <div className="rMax">
                            Max people: <b>{item.maxPeople}</b>
                        </div>
                        <div className='rPrice'>{item.price}</div>
                    </div>
                    <div className="rSelectRooms">
                    <div className="room">
                        {item.roomNumbers.map(roomNumber=>{
                          return(<>
                               <label>{roomNumber.number}</label>
                               <input 
                                type="checkbox"
                                value={roomNumber._id} 
                                onChange={handleSelect}
                                disabled={!isAvailable(roomNumber)}
                                />
                            </>)
                        })}
                      </div>
                    </div>
                </div>
                )
            })}
            <button className='rButton' onClick={handleClick}>Reserve Now!</button>
        </div>
    </div>
  )
}

export default Reserve