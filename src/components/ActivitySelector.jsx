import { useEffect, useState } from "react"

export default function ActivitySelector({ activities, onSelect }) {
    const [search, setSearch] = useState("")

    // 根据输入进行模糊过滤
    const filtered = activities.filter(
        act =>
            act.activityName.includes(search) ||
            act.venueName?.includes(search)
    )

    return (
        <div className="mb-4">
            <input
                list="activity-options"
                placeholder="活动名称或场馆搜索"
                className="w-full border p-2 rounded"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <datalist id="activity-options">
                {activities.map((activity) => (
                    <option key={activity.id} value={activity.activityName} />
                ))}
            </datalist>
            <div>
                {search &&
                    filtered.slice(0, 5).map((activity) => (
                        <div
                            key={activity.id}
                            className="cursor-pointer hover:bg-green-100 px-2 py-1 rounded"
                            onClick={() => {
                                setSearch(activity.activityName)
                                onSelect(activity)
                            }}
                        >
                            {activity.activityName}（{activity.venueName}）
                        </div>
                    ))}
            </div>
        </div>
    )
}