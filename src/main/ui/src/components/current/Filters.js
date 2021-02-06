import React, { useState, useEffect} from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import '../../styles/current/Filters.scss'

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
        <form className="currentFiltersWrappes">

                {/* <p>Latitude</p> */}
                {<input placeholder= "City" onChange= {event =>{buildFilter(event.target.value, "name", "eq")}}></input>}

                {<input placeholder= "Latitude from" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "gte")}}></input>}
                {<input placeholder= "Latitude to" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "lte")}}></input>}
                {<input placeholder= "Longitude from" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "gte")}}></input>}
                {<input placeholder= "Longitude to" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "lte")}}></input>}
                {<input placeholder= "Humidity from" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></input>}
                {<input placeholder= "Humidity to" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></input>}
                {<input placeholder= "Feel temperature from" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "gte")}}></input>}
                {<input placeholder= "Feel temperature to" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "lte")}}></input>}
                {<input placeholder= "Temperature from"  onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "gte")}}></input>}
                {<input placeholder= "Temperature to"  onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "lte")}}></input>}
                {<input placeholder= "Temperature max from" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "gte")}}></input>}
                {<input placeholder= "Temperature max to" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "lte")}}></input>}
                {<input placeholder= "Temperature min from" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "gte")}}></input>}
                {<input placeholder= "Temperature min to" onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "lte")}}></input>}
                <br></br>
                {<Multiselect placeholder="Pick Descriptions" options = {props.descriptions} displayValue='name' showCheckbox={true} onSelect={event =>{buildFilter(makeStringFromSelectedItems(event), "weather.description", "in")}}
                onRemove={event =>{buildFilter(makeStringFromSelectedItems(event), "weather.description", "in")}}/>}
                    {<Multiselect placeholder="Pick Countries" options ={props.countries} displayValue='name'  onSelect={event =>{buildFilter(makeStringFromSelectedItems(event), "sys.country", "in")}}
                onRemove={event =>{buildFilter(makeStringFromSelectedItems(event), "sys.country", "in")}}/>}
        </form>
        )
}

// In db values are in kelvin. The user can change it on the UI.
// I must convert to same units
const calculateKelvins = (temperatureUnits, temperatureValue) => {
    if(temperatureValue === "")
        return ""
    console.log("temperatureUnits:" + temperatureUnits + " and temperatureValue:" + temperatureValue)
    if (temperatureUnits === 'celsius')
        return (parseFloat(temperatureValue) + 273.15).toString()
    if (temperatureUnits === 'fahrenheit')
        return (((parseFloat(temperatureValue) + 459.67) * 5) / 9).toString()
    return temperatureValue
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
const makeStringFromSelectedItems= (items) => {
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.name : prevVal + "," + currVal.name
    }
    return items.reduce(selectedItemsIntoString, '')
}

export default FiltersComponent