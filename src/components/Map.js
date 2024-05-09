import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet"
import {map} from './map.module.css'
import {useState} from "react";

function LocationMarker({setLat, setLng}) {
    const [position, setPosition] = useState(null);

    function setPos(e) {
        setPosition(e.latlng)
        setLat(e.latlng.lat)
        setLng(e.latlng.lng)
    }

    const map = useMapEvents({
        click(e) {
            // map will locate user's position on first click on the map
            if (position === null)
                map.locate()
            setPos(e)
        },
        locationfound(e) {
            map.panTo(e.latlng);
            setPos(e)
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default function MyMap(props) {
    const {lat, lng, setLat, setLng} = props;
    return <MapContainer
        className={map}
        center={[lat, lng]}
        zoom={12}
        scrollWheelZoom={false}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setLat={setLat} setLng={setLng} />
    </MapContainer>
}