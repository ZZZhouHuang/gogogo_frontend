import { useEffect, useState } from "react"
import axios from "axios"

export default function ActivitySelector({ value, onChange }) {
    const [activities, setActivities] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8080/api/activity/all")
            .then(res => {
                if (res.data.code === "200") {
                    setActivities(res.data.data) // VenueVO[]
                    console.log("activities:", res.data.data)
                }
            })
            .catch(err => {
                console.error("获取活动失败", err)
            })
    }, [])

    return (
        <>
            <input
                list="activity-options"
                placeholder="活动搜索"
                className="w-full border p-2 rounded"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <datalist id="venue-options">
                {activities.map((activity) => (
                    <option key={activity.id} value={activity.activityName} />
                ))}
            </datalist>
        </>
    )
}
