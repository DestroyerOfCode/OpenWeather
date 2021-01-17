import React, { useState, useEffect, useCallback} from "react";
import { Multiselect } from 'multiselect-react-dropdown';
function FiltersComponent(props) {
   
    //TODO find out how to call setMethod in buildFilter function
    const [filterKey, setFilterKey] = useState("")
    const [filtervalue, setFilterValue] = useState("");
    const [filterOperator, setFilterOperator] = useState("");

    useEffect(() => {
        const timeOutId = setTimeout(() => props.onChangeMethod(filtervalue, filterKey, filterOperator), 500);
        return () => clearTimeout(timeOutId);
    }, [filterKey, filtervalue, filterOperator]);

    var buildFilter = (filterValue, filterKey, filterOperator) => {
        setFilterValue(filterValue); setFilterKey(filterKey); setFilterOperator(filterOperator)
    }

    return (
        <div className="row">
            {<input placeholder= "Id" onChange= {event => {buildFilter(event.target.value, "_id", "eq")}}></input>}
            {<textarea placeholder= "City name" onChange= {event =>{buildFilter(event.target.value, "name", "eq")}}></textarea>}
            {<Multiselect options ={props.countries} displayValue='name'  onSelect={event =>{buildFilter(makeStringFromSelectedItems(event), "sys.country", "in")}}
            onRemove={event =>{buildFilter(makeStringFromSelectedItems(event), "sys.country", "in")}}/>}
            {<textarea placeholder= "Latitude smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "lte")}}></textarea>}
            {<textarea placeholder= "Latitude bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "gte")}}></textarea>}
            {<textarea placeholder= "Longitude smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "lte")}}></textarea>}
            {<textarea placeholder= "Longitude bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "gte")}}></textarea>}
            {<textarea placeholder= "Humidity smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></textarea>}
            {<textarea placeholder= "Humidity bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></textarea>}
            {<textarea placeholder= "Feel temperature smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></textarea>}
            {<textarea placeholder= "Feel temperature bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></textarea>}
            {<textarea placeholder= "Temperature smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></textarea>}
            {<textarea placeholder= "Temperature bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></textarea>}
            {<textarea placeholder= "Temperature max smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></textarea>}
            {<textarea placeholder= "Temperature max bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></textarea>}
            {<textarea placeholder= "Temperature min smaller than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></textarea>}
            {<textarea placeholder= "Temperature min bigger than" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></textarea>}
            {<Multiselect options ={props.descriptions} displayValue='name'  onSelect={event =>{buildFilter(makeStringFromSelectedItems(event), "weather.description", "in")}}
            onRemove={event =>{buildFilter(makeStringFromSelectedItems(event), "weather.description", "in")}}/>}
        </div>)
}

const isNumber = (item) => {
    console.log("typeof: " + typeof item)
    console.log("isNan: " + !isNaN(item))
    var isNumber = !isNaN(item)
    if (!isNumber) alert('You must pick a number in this field')
    return isNumber
}

// this closure's purpose is to create strings to be sent to query params, as no 
// other way to send arrays exists
function makeStringFromSelectedItems (items) {
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.name : prevVal + "," + currVal.name
    }
    return items.reduce(selectedItemsIntoString, '')
}

export default FiltersComponent