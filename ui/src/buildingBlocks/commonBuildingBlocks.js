import Dropdown from 'react-bootstrap/Dropdown'
import {nanoid} from 'nanoid'
import i18n from 'i18next'
import CircularProgress from '@material-ui/core/CircularProgress';

export const temperatureDropdownList =(changeTemperatureUnitsState) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">{i18n.t("common.temperatureDropdown.title")}</Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={async () => {await Promise.resolve().then(() => {changeTemperatureUnitsState('kelvin', 'K')})} }>Kelvin</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await Promise.resolve().then(() => {changeTemperatureUnitsState('celsius', '°C')})}}>Celsius</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await Promise.resolve().then(() => {changeTemperatureUnitsState('fahrenheit', '°F')})}}>Fahrenheit</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export const customCircularLoader = () => {
    return <CircularProgress thickness={5} size={1000} />
}