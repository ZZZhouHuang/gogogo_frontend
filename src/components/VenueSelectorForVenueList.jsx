import { useState } from "react";

export default function VenueSelectorForVenueList({ venues, onSelect }) {
    const [search, setSearch] = useState("");

    // 根据输入进行模糊过滤
    const filtered = venues.filter(
        v =>
            v.venueName.includes(search) ||
            v.location?.includes(search)
    );

    return (
        <div className="mb-4">
            <input
                list="venue-options"
                placeholder="场馆名称或位置搜索"
                className="w-full border p-2 rounded"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <datalist id="venue-options">
                {venues.map((venue) => (
                    <option key={venue.id} value={venue.venueName} />
                ))}
            </datalist>
            <div>
                {search &&
                    filtered.slice(0, 5).map((venue) => (
                        <div
                            key={venue.id}
                            className="cursor-pointer hover:bg-green-100 px-2 py-1 rounded"
                            onClick={() => {
                                setSearch(venue.venueName);
                                onSelect(venue);
                            }}
                        >
                            {venue.venueName}（{venue.location}）
                        </div>
                    ))}
            </div>
        </div>
    );
}