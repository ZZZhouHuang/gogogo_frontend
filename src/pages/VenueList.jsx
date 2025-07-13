import React, { useEffect, useState } from "react";

export default function VenueList() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/venues")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("无法加载场馆数据");
                }
                return res.json();
            })
            .then((data) => {
                if (data.code === "200") {
                    setVenues(data.data);
                } else {
                    throw new Error(data.msg || "获取失败");
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-gray-600">加载中...</div>;
    if (error) return <div className="text-red-500">错误：{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">活动场馆</h2>
            {venues.length === 0 ? (
                <p className="text-gray-500">暂无场馆信息</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <div key={venue.id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-green-800">{venue.name}</h3>
                            <p className="text-sm text-gray-500">地址：{venue.location}</p>
                            <p className="text-sm text-gray-500">容量：{venue.capacity} 人</p>
                            {venue.description && (
                                <p className="text-sm text-gray-600 mt-2">{venue.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
