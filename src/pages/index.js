import {useState} from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())

function WeatherTableRow({day}) {
    const date = day.date;
    const min = day.minTemperature;
    const max = day.maxTemperature;
    const pv = day.pvproduction;
    const code = day.weatherCode;
    return (
        <tr>
            <td>{date}</td>
            <td>{min}</td>
            <td>{max}</td>
            <td>{pv}</td>
            <td>{code}</td>
        </tr>
    );
}

function ParameterInput({
                            latitude,
                            longitude,
                            onLatitudeChange,
                            onLongitudeChange,
                            onRequestClick
                        }) {
    return (
        <form>
            <input
                type={"number"}
                value={latitude}
                placeholder={"latitude"}
                onChange={(e) => onLatitudeChange(e.target.value)}
            />
            <input
                type={"number"}
                value={longitude}
                placeholder={"longitude"}
                onChange={(e) => onLongitudeChange(e.target.value)}
            />
            <input
                type={"button"}
                value={"Request"}
                onClick={onRequestClick}
            />
        </form>
    );
}

function WeatherTable({elements}) {
    const rows = [];

    if (elements != null)
        elements.forEach((day) => {
            rows.push(
                <WeatherTableRow
                    day={day}
                    key={day.date}
                />
            )
        });

    return (
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Min temp.</th>
                <th>Max temp.</th>
                <th>PV prod.</th>
                <th>Weather</th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>
    );
}

function SearchableProductTable() {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [isRequested, setIsRequested] = useState(false);

    function onRequestButtonClick() {
        if (latitude && longitude)
            setIsRequested(true);
    }

    const {data} = useSWR(isRequested ? 'https://weather-service-b2i7.onrender.com/forecast?latitude=' + latitude + '&longitude=' + longitude : null, fetcher);

    return (
        <div>
            <ParameterInput
                latitude={latitude}
                longitude={longitude}
                onLatitudeChange={setLatitude}
                onLongitudeChange={setLongitude}
                onRequestClick={onRequestButtonClick}
            />
            <WeatherTable elements={data}/>
        </div>
    );
}

export default function Main() {
    return <SearchableProductTable/>;
}
