import Dropdown from 'react-bootstrap/Dropdown'
import {nanoid} from 'nanoid'
import i18n from 'i18next'

export const temperatureDropdownList =(changeTemperatureUnitsState) => {
    return (
    <div key={nanoid()} className="temperatureDropdown">
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">{i18n.t("common.temperatureDropdown.title")}</Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={async () => {await Promise.resolve().then(() => {changeTemperatureUnitsState('kelvin', 'K')})} }>Kelvin</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await Promise.resolve().then(() => {changeTemperatureUnitsState('celsius', '°C')})}}>Celsius</Dropdown.Item>
                <Dropdown.Item onClick={async () => {await Promise.resolve().then(() => {changeTemperatureUnitsState('fahrenheit', '°F')})}}>Fahrenheit</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>
    )
}