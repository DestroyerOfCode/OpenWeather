import React, { useState, useEffect} from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import '../../styles/current/Filters.scss'
import i18n from 'i18next'

function FiltersComponent(props) {
   
    //TODO find out how to call setMethod in buildFilter function
    const [filterKey, setFilterKey] = useState("")
    const [filtervalue, setFilterValue] = useState("");
    const [filterOperator, setFilterOperator] = useState("");

    useEffect(() => {
        const timeOutId = setTimeout(() => props.onChangeMethod(filtervalue, filterKey, filterOperator), 500);
        return () => clearTimeout(timeOutId);
    }, [filterKey, filtervalue, filterOperator, props]);

    var buildFilter = (filterValue, filterKey, filterOperator) => {
        setFilterValue(filterValue); setFilterKey(filterKey); setFilterOperator(filterOperator)
    }

    return (
        <form className="currentFiltersWrappes">

                {/* <p>Latitude</p> */}
                {<input placeholder= {i18n.t("current.filters.cityName")} onChange= {event =>{buildFilter(event.target.value, "name", "eq")}}></input>}

                {<input placeholder= {i18n.t("current.filters.latitudeFrom")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.latitudeTo")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "lte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.longitudeFrom")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.longitudeTo")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "lte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.humidityFrom")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.humidityTo")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.feelTemperatureFrom")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.feelTemperatureTo")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "lte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.temperatureFrom" )} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.temperatureTo" )} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "lte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.temperatureMaxFrom")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.temperatureMaxTo")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "lte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.temperatureMinFrom")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "gte")}}></input>}
                {<input placeholder= {i18n.t("current.filters.temperatureMinTo")} onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "lte")}}></input>}
                <br></br>
                {<Multiselect placeholder={i18n.t("current.filters.pickDescriptions")} options = {props.descriptions} displayValue='name' showCheckbox={true} onSelect={event =>{buildFilter(makeStringFromDescriptions(event), "weather.description", "in")}}
                onRemove={event =>{buildFilter(makeStringFromDescriptions(event), "weather.description", "in")}}/>}
                    {<Multiselect placeholder={i18n.t("current.filters.pickCountries")} options ={props.countries} displayValue='name'  onSelect={event =>{buildFilter(makeStringFromCountries(event), "sys.country", "in")}}
                onRemove={event =>{buildFilter(makeStringFromCountries(event), "sys.country", "in")}}/>}
        </form>
        )
}

// In db values are in kelvin. The user can change it on the UI.
// I must convert to same units
const calculateKelvins = (temperatureUnits, temperatureValue) => {
    if(temperatureValue === "")
        return ""
    if (temperatureUnits === 'celsius')
        return (parseFloat(temperatureValue) + 273.15).toString()
    if (temperatureUnits === 'fahrenheit')
        return (((parseFloat(temperatureValue) + 459.67) * 5) / 9).toString()
    return temperatureValue
}


const isNumber = (item) => {
    var isNumber = !isNaN(item)
    if (!isNumber) alert('You must pick a number in this field')
    return isNumber
}

// this closure's purpose is to create strings to be sent to query params, as no 
// other way to send arrays exists
const makeStringFromDescriptions= (items) => {
    console.log("description filter: " + JSON.stringify(items))
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.originalValue : prevVal + "," + currVal.originalValue
    }
    return items.reduce(selectedItemsIntoString, '')
}
const makeStringFromCountries= (items) => {
    console.log("description filter: " + JSON.stringify(items))
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.name : prevVal + "," + currVal.name
    }
    return items.reduce(selectedItemsIntoString, '')
}
export default FiltersComponent