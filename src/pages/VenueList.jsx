import React, { useEffect, useState } from "react";
import axios from "axios";
import VenueSelectorForVenueList from "../components/VenueSelectorForVenueList.jsx";

export default function VenueList() {
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/venue/all")
            .then(response => {
                const res = response.data;
                if (res.code === "200") {
                    setVenues(res.data);
                    setSelectedVenue(res.data[0] || null);
                } else {
                    setError(res.msg || "获取场馆失败");
                }
            })
            .catch(err => {
                console.error("获取场馆列表失败", err);
                setError("网络错误或服务器无响应");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="p-4">加载中...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-6 p-4">
            {/* 左侧场馆列表 */}
            <div className="md:w-1/3 w-full">
                <h2 className="text-xl font-bold mb-4 text-green-700">所有场馆</h2>
                {/* 搜索选择器 */}
                <VenueSelectorForVenueList
                    venues={venues}
                    onSelect={venue => setSelectedVenue(venue)}
                />
                <div className="space-y-2">
                    {venues.map((venue) => (
                        <div
                            key={venue.id}
                            className={`border p-3 rounded cursor-pointer hover:bg-green-50 ${
                                selectedVenue?.id === venue.id ? "border-green-500 bg-green-50" : ""
                            }`}
                            onClick={() => setSelectedVenue(venue)}
                        >
                            <h3 className="font-semibold">{venue.venueName}</h3>
                            <p className="text-sm text-gray-600">{venue.location}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 右侧场馆详情 */}
            <div className="md:w-2/3 w-full">
                {selectedVenue ? (
                    <div className="border rounded p-4 shadow bg-white">
                        <img
                            src={selectedVenue.imageUrl}
                            alt={selectedVenue.venueName}
                            className="w-full h-64 object-cover rounded mb-4"
                        />
                        <h2 className="text-2xl font-bold mb-2">{selectedVenue.venueName}</h2>
                        <p className="text-gray-600 mb-1">位置：{selectedVenue.location}</p>
                        <p className="text-gray-700 mt-4">{selectedVenue.description}</p>
                    </div>
                ) : (
                    <p>请选择一个场馆查看详情</p>
                )}
            </div>
        </div>
    );
}