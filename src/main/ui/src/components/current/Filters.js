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

    const getPlaceholder = (filter, translationKey, filterKey, filterOperator, defaultCompareValue) => {
        // console.log("filterStringify: " + JSON.stringify(filter))
        // console.log("filter[filterKey]: " + filter[filterKey] + " defaultCompareValue: " + defaultCompareValue)
        let ret = ""
        // if (translationKey !== "pickDescriptions" && translationKey !== "pickCountries")
            ret = i18n.t(`current.filters.${translationKey}`);
        filter.some((item) => {
            // console.log( filterKey in item)
            if ( filterKey in item && filterOperator in item[filterKey]) {
                console.log("item[filterKey]: " + JSON.stringify(item[filterKey]))

                // setFunc(props.filters[filterKey][filterOperator])
                ret += " " + item[filterKey][filterOperator];
                return true;
            }
            else return false
        })
        return ret;
    }

    const getSelectedDescriptions= (filters, filterKey, filterOperator, descriptions) =>{

        let retArr= []
        console.log(filters)
        filters.some((item) => {
            if (filterKey in item && filterOperator in item[filterKey]){
                console.log("item[filterKey][filterOperator]: " + item[filterKey][filterOperator])
                item[filterKey][filterOperator].split(",").forEach((description) => {
                    let originalValue = ""
                    descriptions.some((item) => {
                        console.log(item)
                        if(description === item.originalValue){
                            originalValue = item.originalValue
                            return true;
                        } return false
                    })
                    console.log(description)
                    retArr.push({"name": i18n.t(`common.description.${description}`), "originalValue": originalValue})
                })
                return true;
            }
            return false;
        })
        console.log(retArr)
        return retArr
    }

    const getSelectedCountries= (filters, filterKey, filterOperator) =>{

        let retArr = []
        filters.some((item) =>{
            if (filterKey in item && filterOperator in item[filterKey]){

                item[filterKey][filterOperator].split(",").forEach((country) => {
                    retArr.push({"name": country})
                })
                return true;
            }
            return false;
        })
        return retArr
    }

    console.log(props.descriptions)
    return (
        <form className="currentFiltersWrappes">
                {<input placeholder= {getPlaceholder(props.filters, "cityName", "name", "eq") } onChange= {event =>{buildFilter(event.target.value, "name", "eq")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "latitudeFrom", "coord.lat", "gte")} onChange= {event =>{if (isNumber(event.target.value)) {buildFilter(event.target.value, "coord.lat", "gte")}}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "latitudeTo", "coord.lat", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lat", "lte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "longitudeFrom", "coord.lon", "gte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "gte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "longitudeTo", "coord.lon", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "coord.lon", "lte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "humidityFrom", "weatherMain.humidity", "gte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "gte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "humidityTo", "weatherMain.humidity", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(event.target.value, "weatherMain.humidity", "lte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "feelTemperatureFrom", "weatherMain.feels_like", "gte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "gte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "feelTemperatureTo", "weatherMain.feels_like", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.feels_like", "lte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "temperatureFrom", "weatherMain.temp", "gte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "gte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "temperatureTo", "weatherMain.temp", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp", "lte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "temperatureMaxFrom", "weatherMain.temp_max", "gte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "gte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "temperatureMaxTo", "weatherMain.temp_max", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_max", "lte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "temperatureMinFrom", "weatherMain.temp_min", "gte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "gte")}}></input>}
                {<input placeholder= {getPlaceholder(props.filters, "temperatureMinTo", "weatherMain.temp_min", "lte") } onChange= {event =>{if (isNumber(event.target.value)) buildFilter(calculateKelvins(props.temperatureUnits, event.target.value), "weatherMain.temp_min", "lte")}}></input>}
                <br></br>
                {<Multiselect selectedValues={getSelectedDescriptions(props.filters, "weather.description", "in", props.descriptions)} placeholder={i18n.t("current.filters.pickDescriptions")} options = {props.descriptions} displayValue='name' showCheckbox={true} onSelect={event =>{console.log(event);buildFilter(makeStringFromDescriptions(event), "weather.description", "in")}}
                onRemove={event =>{buildFilter(makeStringFromDescriptions(event), "weather.description", "in")}}/>}
                    {<Multiselect selectedValues={getSelectedCountries(props.filters, "sys.country", "in")} placeholder={i18n.t("current.filters.pickCountries")} options ={props.countries} displayValue='name'  onSelect={event =>{buildFilter(makeStringFromCountries(event), "sys.country", "in")}}
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
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.originalValue : prevVal + "," + currVal.originalValue
    }
    console.log(items)
    console.log(items.reduce(selectedItemsIntoString, ''))
    return items.reduce(selectedItemsIntoString, '')
}
const makeStringFromCountries= (items) => {
    var selectedItemsIntoString = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.name : prevVal + "," + currVal.name
    }
    return items.reduce(selectedItemsIntoString, '')
}
export default FiltersComponent