import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VenueList() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/venue/all")
            .then(response => {
                const res = response.data;
                if (res.code === "200") {
                    setVenues(res.data);
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

    if (loading) return <div className="text-center mt-8">加载中...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map(venue => (
                <div key={venue.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <img
                        src={venue.imageUrl}
                        alt={venue.venueName}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-green-700">{venue.venueName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{venue.location}</p>
                        <p className="mt-2 text-gray-700">{venue.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
