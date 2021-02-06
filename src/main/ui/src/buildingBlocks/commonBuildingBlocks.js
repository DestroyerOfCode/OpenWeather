import Dropdown from 'react-bootstrap/Dropdown'

export const temperatureDropdownList =(changeTemperatureUnitsState) => {
    return (
    <div className="temperatureDropdown">
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">Change Temperature Units</Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => {changeTemperatureUnitsState('kelvin', 'K');} }>Kelvin</Dropdown.Item>
                <Dropdown.Item onClick={() => {changeTemperatureUnitsState('celsius', '°C');}}>Celsius</Dropdown.Item>
                <Dropdown.Item onClick={() => {changeTemperatureUnitsState('fahrenheit', '°F');}}>Fahrenheit</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>
    )
}