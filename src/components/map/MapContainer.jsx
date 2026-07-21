import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { INVENTORY_STATUS } from '../../utils/constants'

// Fix Leaflet default icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const COLOR = {
  [INVENTORY_STATUS.AVAILABLE]:    '#22C55E',
  [INVENTORY_STATUS.LOW_STOCK]:    '#F59E0B',
  [INVENTORY_STATUS.OUT_OF_STOCK]: '#9CA9A7',
}

function makeIcon(status) {
  const color = COLOR[status] || '#586F6B'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
    <circle cx="12" cy="12" r="11" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
    <line x1="12" y1="23" x2="12" y2="32" stroke="${color}" stroke-width="2"/>
  </svg>`
  return L.divIcon({
    html: svg, className: '', iconSize: [24, 32], iconAnchor: [12, 32], popupAnchor: [0, -32],
  })
}

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.flyTo(center, 14, { duration: 1 }) }, [center, map])
  return null
}

export default function MapContainer({ pins=[], center=[-1.9441, 30.0619], zoom=13, onPinClick, height='175px' }) {
  return (
    <LeafletMap center={center} zoom={zoom} style={{ height, width:'100%' }} className="rounded-md z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FlyTo center={center}/>
      {pins.map(pin => (
        <Marker key={pin.clinic_id} position={[pin.latitude, pin.longitude]} icon={makeIcon(pin.traffic_light_status)}
          eventHandlers={{ click: () => onPinClick?.(pin) }}>
          <Popup>
            <p className="font-semibold text-sm">{pin.clinic_name}</p>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  )
}
