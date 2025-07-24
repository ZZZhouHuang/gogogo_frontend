import { useEffect, useState } from "react"
import axios from "axios"

export default function VenueSelector({ value, onChange }) {
    const [venues, setVenues] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8080/api/venue/all")
            .then(res => {
                if (res.data.code === "200") {
                    setVenues(res.data.data) // VenueVO[]
                    console.log("venues:", res.data.data)
                }
            })
            .catch(err => {
                console.error("获取场馆失败", err)
            })
    }, [])

    return (
        <>
            <input
                list="venue-options"
                placeholder="选择场馆"
                className="w-full border p-2 rounded"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <datalist id="venue-options">
                {venues.map((venue) => (
                    <option key={venue.id} value={venue.venueName} />
                ))}
            </datalist>
        </>
    )
}
