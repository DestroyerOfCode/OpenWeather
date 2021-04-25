import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Multiselect } from 'multiselect-react-dropdown';
import i18n from 'i18next';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {
    filtersActions,
    countriesActions,
    descriptionsActions,
} from '../../actions';
import { nanoid } from 'nanoid';
import { convertTemperature } from '../../businessLogic/WeatherBusinessLogic';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

function FiltersComponent(props) {
    const filters = useSelector((state) => state.filters);
    const countries = useSelector((state) => state.countries);
    const descriptions = useSelector((state) => state.descriptions);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(descriptionsActions.getDescriptions());
        dispatch(countriesActions.getCountries());
    }, []);

    const onBlurEvent = (event, filterName, filterOperator) => {
        props.handleChangePage(null, 0);
        dispatch(
            filtersActions.update(filterName, filterOperator, event, filters)
        );
    };

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={String} htmlFor="component-simple">
                        {i18n.t('current.filters.cityName')}
                    </InputLabel>
                    <Input
                        id={nanoid()}
                        defaultValue={filters?.name?.$eq}
                        onBlur={(event) =>
                            onBlurEvent(event.target.value, 'name', '$eq')
                        }
                    />
                </FormControl>
                <FormControl>
                    <InputLabel
                        variant="standard"
                        type={String}
                        htmlFor="component-simple"
                    >
                        {i18n.t('current.filters.latitude')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        fullWidth={false}
                        placeholder={i18n.t('common.from')}
                        id={nanoid()}
                        defaultValue={filters['coord.lat']?.$gte}
                        onBlur={(event) =>
                            onBlurEvent(
                                parseFloat(event.target.value),
                                'coord.lat',
                                '$gte'
                            )
                        }
                    />
                </FormControl>
                <FormControl>
                    <InputLabel type={String} htmlFor="component-simple">
                        {i18n.t('current.filters.latitude')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        defaultValue={filters['coord.lat']?.$lte}
                        onBlur={(event) =>
                            onBlurEvent(
                                parseFloat(event.target.value),
                                'coord.lat',
                                '$lte'
                            )
                        }
                    />
                </FormControl>
                <FormControl>
                    <InputLabel type={String} htmlFor="component-simple">
                        {i18n.t('current.filters.longitude')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.from')}
                        id={nanoid()}
                        defaultValue={filters['coord.lon']?.$gte}
                        onBlur={(event) =>
                            onBlurEvent(
                                parseFloat(event.target.value),
                                'coord.lon',
                                '$gte'
                            )
                        }
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={String} htmlFor="component-simple">
                        {i18n.t('current.filters.longitude')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        defaultValue={filters['coord.lon']?.$lte}
                        onBlur={(event) =>
                            onBlurEvent(
                                parseFloat(event.target.value),
                                'coord.lon',
                                '$lte'
                            )
                        }
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.humidity')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        type={Number}
                        placeholder={i18n.t('common.from')}
                        id={nanoid()}
                        defaultValue={filters['weatherMain.humidity']?.$gte}
                        onBlur={(event) =>
                            onBlurEvent(
                                parseFloat(event.target.value),
                                'weatherMain.humidity',
                                '$gte'
                            )
                        }
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.humidity')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        type={Number}
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        defaultValue={filters['weatherMain.humidity']?.$lte}
                        onBlur={(event) => {
                            if (event && event.target.value !== '')
                                return onBlurEvent(
                                    parseFloat(event.target.value),
                                    'weatherMain.humidity',
                                    '$lte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.humidity',
                                    '$lte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.feelTemperature')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.from')}
                        id={nanoid()}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.feels_like']?.$gte
                        )}
                        onBlur={(event) => {
                            if (event && event.target.value !== '')
                                return onBlurEvent(
                                    calculateKelvins(
                                        props.temperatureUnits,
                                        event.target.value
                                    ),
                                    'weatherMain.feels_like',
                                    '$gte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.feels_like',
                                    '$gte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.feelTemperature')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.feels_like']?.$lte
                        )}
                        onBlur={(event) => {
                            if (event && event.target.value !== '')
                                return onBlurEvent(
                                    calculateKelvins(
                                        props.temperatureUnits,
                                        event.target.value
                                    ),
                                    'weatherMain.feels_like',
                                    '$lte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.feels_like',
                                    '$lte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={String} htmlFor="component-simple">
                        {i18n.t('current.filters.temperatureMax')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.from')}
                        id="component-simple"
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.temp_max']?.$gte
                        )}
                        onBlur={(event) => {
                            if (event.target.value !== '')
                                return onBlurEvent(
                                    calculateKelvins(
                                        props.temperatureUnits,
                                        event.target.value
                                    ),
                                    'weatherMain.temp_max',
                                    '$gte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.temp_max',
                                    '$gte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.temperatureMax')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.temp_max']?.$lte
                        )}
                        onBlur={(event) => {
                            if (event.target.value !== '')
                                return onBlurEvent(
                                    calculateKelvins(
                                        props.temperatureUnits,
                                        event.target.value
                                    ),
                                    'weatherMain.temp_max',
                                    '$lte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.temp_max',
                                    '$lte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.temperatureMin')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.from')}
                        id={nanoid()}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.temp_min']?.$gte
                        )}
                        onBlur={(event) => {
                            if (event.target.value !== '')
                                return onBlurEvent(
                                    calculateKelvins(
                                        props.temperatureUnits,
                                        event.target.value
                                    ),
                                    'weatherMain.temp_min',
                                    '$gte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.temp_min',
                                    '$gte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.temperatureMin')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.temp_min']?.$lte
                        )}
                        onBlur={(event) => {
                            if (event.target.value !== '')
                                return onBlurEvent(
                                    calculateKelvins(
                                        props.temperatureUnits,
                                        event.target.value
                                    ),
                                    'weatherMain.temp_min',
                                    '$lte'
                                );
                            else
                                return onBlurEvent(
                                    '',
                                    'weatherMain.temp_min',
                                    '$lte'
                                );
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={false} variant="filled" size="small">
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.temperature')}{' '}
                        {i18n.t('common.from')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.from')}
                        id={nanoid()}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.temp']?.$gte
                        )}
                        onBlur={(event) => {
                            return onBlurEvent(
                                calculateKelvins(
                                    props.temperatureUnits,
                                    event.target.value
                                ),
                                'weatherMain.temp',
                                '$gte'
                            );
                        }}
                    />
                </FormControl>
                <FormControl
                    fullWidth={false}
                    variant="filled"
                    size="small"
                    type={Number}
                >
                    <InputLabel type={Number} htmlFor="component-simple">
                        {i18n.t('current.filters.temperature')}{' '}
                        {i18n.t('common.to')}
                    </InputLabel>
                    <Input
                        placeholder={i18n.t('common.to')}
                        id={nanoid()}
                        type={Number}
                        defaultValue={convertTemperature(
                            props.temperatureUnits,
                            filters['weatherMain.temp']?.$lte
                        )}
                        onBlur={(event) => {
                            return onBlurEvent(
                                calculateKelvins(
                                    props.temperatureUnits,
                                    event.target.value
                                ),
                                'weatherMain.temp',
                                '$lte'
                            );
                        }}
                    />
                </FormControl>
                <Multiselect
                    selectedValues={getSelectedDescriptions(
                        filters['weather.description']?.$in,
                        descriptions
                    )}
                    placeholder={i18n.t('current.filters.pickDescriptions')}
                    options={descriptions}
                    displayValue="name"
                    onSelect={(event) =>
                        dispatch(
                            filtersActions.update(
                                'weather.description',
                                '$in',
                                event.map((desc) => desc.originalValue),
                                filters
                            )
                        )
                    }
                    onRemove={(event) =>
                        dispatch(
                            filtersActions.update(
                                'weather.description',
                                '$in',
                                event.map((desc) => desc.originalValue),
                                filters
                            )
                        )
                    }
                />
                <Multiselect
                    selectedValues={getSelectedCountries(
                        filters['sys.countryName']?.$in,
                        countries
                    )}
                    placeholder={i18n.t('current.filters.pickCountries')}
                    options={countries}
                    displayValue="countryName"
                    onSelect={(event) =>
                        dispatch(
                            filtersActions.update(
                                'sys.countryName',
                                '$in',
                                event.map(
                                    (country) => country.originalCountryName
                                ),
                                filters
                            )
                        )
                    }
                    onRemove={(event) =>
                        dispatch(
                            filtersActions.update(
                                'sys.countryName',
                                '$in',
                                event.map(
                                    (country) => country.originalCountryName
                                ),
                                filters
                            )
                        )
                    }
                />
            </form>

            <Button
                variant="contained"
                onClick={() => dispatch(filtersActions.clear())}
                size="medium"
                color="primary"
            >
                {i18n.t('common.clearFilters')}
            </Button>
        </>
    );
}

const getSelectedDescriptions = (descriptionValues, descriptions) => {
    if (Array.isArray(descriptionValues)) {
        return descriptions.filter((d) =>
            descriptionValues.includes(d.originalValue)
        );
    }
    return {};
};

const getSelectedCountries = (countryValues, countries) => {
    if (countryValues !== undefined && Array.isArray(countryValues))
        return countries.filter((c) =>
            countryValues.includes(c.originalCountryName)
        );
    return {};
};

// In db values are in kelvin. The user can change it on the UI.
// I must convert to same units
const calculateKelvins = (temperatureUnits, temperatureValue) => {
    if (temperatureValue === '') return '';
    if (temperatureUnits === 'celsius')
        return parseFloat(temperatureValue) + 273.15;
    if (temperatureUnits === 'fahrenheit')
        return ((parseFloat(temperatureValue) + 459.67) * 5) / 9;
    return parseFloat(temperatureValue);
};

export default FiltersComponent;
