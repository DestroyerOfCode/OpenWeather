import Dropdown from 'react-bootstrap/Dropdown'
import {nanoid} from 'nanoid'
import i18n from 'i18next'

export const temperatureDropdownList =(changeTemperatureUnitsState) => {
    return (
    <div key={nanoid()} className="temperatureDropdown">
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">{i18n.t("common.temperatureDropdown.title")}</Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => {changeTemperatureUnitsState('kelvin', 'K');} }>Kelvin</Dropdown.Item>
                <Dropdown.Item onClick={() => {changeTemperatureUnitsState('celsius', '°C');}}>Celsius</Dropdown.Item>
                <Dropdown.Item onClick={() => {changeTemperatureUnitsState('fahrenheit', '°F');}}>Fahrenheit</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>
    )
}