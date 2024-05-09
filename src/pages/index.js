import {useEffect, useMemo, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCloud,
    faCloudBolt,
    faCloudRain, faCloudShowersHeavy, faCloudShowersWater,
    faCloudSun, faMoon,
    faSmog,
    faSnowflake,
    faSun
} from "@fortawesome/free-solid-svg-icons";
import styles from './index.module.css';
import dynamic from "next/dynamic";
import {error} from "next/dist/build/output/log";

function getIcon(code) {
    let icon;
    switch (code) {
        case 0:
        case 1:
            icon = faSun;
            break;
        case 2:
            icon = faCloudSun;
            break;
        case 3:
            icon = faCloud;
            break;
        case 45:
        case 48:
            icon = faSmog;
            break;
        case 56:
        case 57:
        case 66:
        case 67:
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            icon = faSnowflake;
            break;
        case 51:
        case 53:
        case 55:
        case 61:
        case 63:
            icon = faCloudRain;
            break;
        case 65:
        case 80:
        case 81:
            icon = faCloudShowersHeavy;
            break;
        case 82:
        case 99:
            icon = faCloudShowersWater;
            break;
        case 95:
        case 96:
            icon = faCloudBolt;
            break;
        default:
            return <>{code}</>;
    }
    return <FontAwesomeIcon className={styles.icon} icon={icon}/>;
}

function DarkMode() {
    const [icon, setIcon] = useState(faSun);
    let toggle = 'light';
    useEffect(() => {
        if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIcon(faMoon)
            toggle = 'dark';
            L.map()
        }
    }, [icon, toggle]);

    return <button
        className={styles.darkModeButton}
        onClick={() => {
            if (icon === faSun) {
                setIcon(faMoon);
                document.body.classList.toggle(toggle)
            } else {
                setIcon(faSun);
                document.body.classList.toggle(toggle)
            }
        }}>
        <FontAwesomeIcon icon={icon}/>
    </button>;
}

function SearchForm({
                        latitude,
                        longitude,
                        onLatitudeChange,
                        onLongitudeChange,
                        onRequestClick
                    }) {
    return (
        <div className={styles.searchForm}>
            <DarkMode/>
            <label>Latitude </label>
            <input
                type={"number"}
                value={latitude}
                style={{width: 100}}
                onChange={(e) => {
                    const regex = RegExp("^-?[0-9]*([.,])?[0-9]*$");
                    if (regex.test(e.target.value))
                        onLatitudeChange(e.target.value);
                }}
            />
            <label style={{'paddingLeft': '40px'}}>Longitude </label>
            <input
                type={"number"}
                value={longitude}
                style={{width: 100}}
                onChange={(e) => {
                    const regex = RegExp("^-?[0-9]*[.,]?[0-9]*$");
                    if (regex.test(e.target.value))
                        onLongitudeChange(e.target.value);
                }}
            />
            <input
                type={"button"}
                value={"Submit"}
                style={{'marginLeft': '40px'}}
                onClick={onRequestClick}
            />
        </div>
    );
}

function WeatherTable({elements}) {
    const headers = [];
    const icons = [];
    const rows = [];

    if (elements.message)
        headers.push(
            <th className={styles.tableHeader} key={elements.message}>{elements.message}</th>
        );
    else {
        elements.forEach((day) => {
            headers.push(
                <th className={styles.tableHeader} key={day.date}>{day.date}</th>
            );
            icons.push(
                <td className={styles.tableIconCell} key={day.date}>{getIcon(day.weatherCode)}</td>
            );
            rows.push(
                <td className={styles.infoCell} key={day.date}>
                    max: {day.maxTemperature}&deg;C<br/>
                    min: {day.minTemperature}&deg;C<br/>
                    PV: {day.pvProduction} kWh
                </td>
            );
        });
    }

    return (
        <table className={styles.table}>
            <thead>
            <tr>{headers}</tr>
            </thead>
            <tbody>
            <tr>{icons}</tr>
            <tr>{rows}</tr>
            </tbody>
        </table>
    );
}

function SearchableProductTable() {
    const [latitude, setLatitude] = useState('50.0490744');
    const [longitude, setLongitude] = useState('19.9639313');
    const [elements, setElements] = useState([]);

    const onRequestButtonClick = async () => {
        setElements({message: 'Waiting for response'});
        const url = 'http://localhost:8080/forecast?' +
            (latitude !== '' ? 'latitude=' + latitude : '') +
            (longitude !== '' ? (latitude !== '' ? '&' : '') + 'longitude=' + longitude : '');
        await fetch(url)
            .then(res => res.json())
            .then(data => setElements(data))
            .catch(() => setElements({message: 'Fetch failed'}))
    }

    const Map = useMemo(() => dynamic(
        () => import('@/components/Map'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <div>
            <div className={styles.tableDiv}>
                <WeatherTable elements={elements}/>
            </div>
            <SearchForm
                latitude={latitude}
                longitude={longitude}
                onLatitudeChange={setLatitude}
                onLongitudeChange={setLongitude}
                onRequestClick={onRequestButtonClick}
            />
            <div>
                <Map lat={latitude} lng={longitude} setLat={setLatitude} setLng={setLongitude}/>
            </div>
        </div>
    );
}

export default function Main() {
    return <SearchableProductTable/>;
}
