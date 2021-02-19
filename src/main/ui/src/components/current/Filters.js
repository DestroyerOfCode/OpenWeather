import React, { useState, useEffect} from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import '../../styles/current/Filters.scss'
import {convertTemperature} from '../../businessLogic/WeatherBusinessLogic'
import i18n from 'i18next'

function FiltersComponent(props) {
   
    const [filterKey, setFilterKey] = useState("")
    const [filtervalue, setFilterValue] = useState("");
    const [filterOperator, setFilterOperator] = useState("");
    const [countries, setCountries] = useState([])
    const [descriptions, setDescriptions] = useState([])

    useEffect(() => {
        const timeOutId = setTimeout(() => props.onChangeMethod(filtervalue, filterKey, filterOperator), 500);
        return () => clearTimeout(timeOutId);
    }, [filterKey, filtervalue, filterOperator, props]);
   
    props.countries.then((res) => setCountries(res))
    props.descriptions.then((res) => setDescriptions(res))

    var buildFilter = (filterValue, filterKey, filterOperator) => {
        setFilterValue(filterValue); setFilterKey(filterKey); setFilterOperator(filterOperator)
    }
        return (
        <form className="currentFiltersWrapper">
            <div >
                <label>
                    {i18n.t("current.filters.latitude")}
                    <input type="number" defaultValue={getOriginalValue(props.filters, props.temperature, "coord.lat", "gte")} placeholder= {i18n.t("common.from")} onChange= {event =>{buildFilter(event.target.value, "coord.lat", "gte")}}/>
                    <input type="number" defaultValue={getOriginalValue(props.filters, props.temperature, "coord.lat", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(event.target.value, "coord.lat", "lte")}}></input>
                </label>
                <label>
                    {i18n.t("current.filters.longitude")}
                    <input type="number" defaultValue={getOriginalValue(props.filters, props.temperature, "coord.lon", "gte")} placeholder= {i18n.t("common.from") } onChange= {event =>{buildFilter(event.target.value, "coord.lon", "gte")}}></input>
                    <input type="number" defaultValue={getOriginalValue(props.filters, props.temperature, "coord.lon", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(event.target.value, "coord.lon", "lte")}}></input>
                </label>
                <label>
                    {i18n.t("current.filters.humidity")}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.humidity", "gte")} placeholder= {i18n.t("common.from") } onChange= {event =>{buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></input>}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.humidity", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></input>}
                </label>
                <label>
                    {i18n.t("current.filters.feelTemperature")}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.feels_like", "gte")} placeholder= {i18n.t("common.from") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "gte")}}></input>}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.feels_like", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "lte")}}></input>}
                </label>
                <label>
                    {i18n.t("current.filters.temperatureMax")}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.temp_max", "gte")} placeholder= {i18n.t("common.from") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "gte")}}></input>}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.temp_max", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "lte")}}></input>}
                </label>
                <label>
                    {i18n.t("current.filters.temperatureMin")}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.temp_min", "gte")} placeholder= {i18n.t("common.from") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "gte")}}></input>}
                    {<input type="number"defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.temp_min", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "lte")}}></input>}
                </label>
                <label>
                    {i18n.t("current.filters.temperature")}
                    {<input type="number"style={{width: "90px"}} defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.temp", "gte")} placeholder= {i18n.t("common.from") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "gte")}}></input>}
                    {<input type="number"style={{width: "90px"}} defaultValue={getOriginalValue(props.filters, props.temperature, "weatherMain.temp", "lte")} placeholder= {i18n.t("common.to") } onChange= {event =>{buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "lte")}}></input>}
                </label>
                <label> 
                    {i18n.t("current.filters.cityName")}
                    <input type="text" defaultValue={getOriginalValue(props.filters, props.temperature, "name", "eq")} placeholder= {i18n.t("current.filters.cityName") } onChange= {event =>{buildFilter(event.target.value, "name", "eq")}}/>
                </label>
            </div>
            {<Multiselect selectedValues={getSelectedDescriptions(props.filters, "weather.description", "in", descriptions)} placeholder={i18n.t("current.filters.pickDescriptions")} options = {descriptions} displayValue='name' onSelect={event =>{buildFilter(makeStringFromDescriptions(event), "weather.description", "in")}}
            onRemove={event =>{buildFilter(makeStringFromDescriptions(event), "weather.description", "in")}}/>}
                {<Multiselect selectedValues={getSelectedCountries(props.filters, "sys.countryName", "in", countries)} placeholder={i18n.t("current.filters.pickCountries")} options ={countries} displayValue='countryName'  onSelect={event =>{buildFilter(makeStringFromCountries(event), "sys.countryName", "in")}}
            onRemove={event =>{buildFilter(makeStringFromCountries(event), "sys.countryName", "in")}}/>}
        </form>
        )
}

const getSelectedDescriptions= (filters, filterKey, filterOperator, descriptions) =>{
    let retArr= []
    filters.some((filter) => {
        if (filterKey in filter && filterOperator in filter[filterKey]){
            filter[filterKey][filterOperator].split(",").forEach((description) => {
                let originalValue = ""
                descriptions.some((item) => {
                    if(description === item.originalValue){
                        originalValue = item.originalValue
                        return true;
                    } return false
                })
                retArr.push({"name": i18n.t(`common.description.${description}`), "originalValue": originalValue})
            })
            return true;
        }
        return false;
    })
    return retArr
}
const getSelectedCountries= (filters, filterKey, filterOperator, countries) =>{
    let retArr = []
    filters.some((filter) =>{
        if (filterKey in filter && filterOperator in filter[filterKey]){
            filter[filterKey][filterOperator].split(",").forEach((countryName) => {
                let originalValue = ""
                countries.some((item) => {
                    console.log(countryName)
                    console.log(item.originalCountryName)
                    if (countryName === item.originalCountryName){
                        originalValue = item.originalCountryName
                        return true;
                    } return false;
                })
                console.log(originalValue)
                retArr.push({"countryName": i18n.t(`common.countryName.${originalValue}`), "originalCountryName": originalValue})
            })
            return true;
        }
        return false;
    })
    console.log(retArr)
    return retArr
}
const getOriginalValue = (filter, temperature, filterKey, filterOperator) => {
    let ret = ""
    const temperatureKeys= [
        "weatherMain.feels_like",
        "weatherMain.temp",
        "weatherMain.temp_max",
        "weatherMain.temp_min"
    ]
    // if (translationKey !== "pickDescriptions" && translationKey !== "pickCountries")
    filter.some((item) => {
        // console.log( filterKey in item)
        if ( filterKey in item && filterOperator in item[filterKey]) {
            if (temperatureKeys.includes(Object.keys(item)[0]))
                ret = Number(convertTemperature(temperature.units, item[filterKey][filterOperator])).toFixed(2)
            else ret = item[filterKey][filterOperator]
            return true;
        }
        else return false
    })
    if(ret !== "")
        return ret;
    return;
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

// this closure's purpose is to create strings to be sent to query params, as no 
// other way to send arrays exists
const makeStringFromDescriptions= (items) => {
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.originalValue : prevVal + "," + currVal.originalValue
    }
    return items.reduce(selectedItemsIntoString, '')
}
const makeStringFromCountries= (items) => {
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.originalCountryName : prevVal + "," + currVal.originalCountryName
    }
    return items.reduce(selectedItemsIntoString, '')
}
export default FiltersComponent