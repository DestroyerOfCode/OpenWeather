import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import i18n from 'i18next';

export const TemperatureDropdownList = (props) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {i18n.t('common.temperatureDropdown.title')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={async () => {
                        await Promise.resolve().then(() => {
                            props.changeTemperatureUnitsState('kelvin', 'K');
                        });
                    }}
                >
                    Kelvin
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={async () => {
                        await Promise.resolve().then(() => {
                            props.changeTemperatureUnitsState('celsius', '°C');
                        });
                    }}
                >
                    Celsius
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={async () => {
                        await Promise.resolve().then(() => {
                            props.changeTemperatureUnitsState(
                                'fahrenheit',
                                '°F'
                            );
                        });
                    }}
                >
                    Fahrenheit
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

const temperatureCtx = React.createContext({
    units: 'celsius',
    abbreviation: '°C',
});
export default temperatureCtx;
