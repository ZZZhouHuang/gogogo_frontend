import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/activity/allCurrent')
            .then((res) => res.json())
            .then((data) => {
                if (data.code === '200') {
                    setActivities(data.data);
                    setSelectedActivity(data.data[0] || null);
                } else {
                    alert('获取活动失败: ' + data.msg);
                }
            })
            .catch((err) => {
                console.error('加载失败:', err);
                alert('加载失败');
            })
            .finally(() => setLoading(false));
    }, []);

    const formatTime = (ts) => {
        if (!ts) return '';
        const str = ts.toString();
        return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)} ${str.slice(8, 10)}:${str.slice(10, 12)}`;
    };

    const handleSignup = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('请先登录');
            navigate('/login');
            return;
        }

        const userInfo = JSON.parse(atob(token.split('.')[1]));
        

        const payload = {
            activityId: selectedActivity.id,
        };

        try {
            const res = await fetch('http://localhost:8080/api/activity/signup', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.code === '200') {
                alert('报名成功！');
            } else {
                alert('报名失败：' + data.msg);
            }
        } catch (error) {
            console.error('报名请求出错:', error);
            alert('报名失败');
        }
    };

    if (loading) return <p className="p-4">加载中...</p>;

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-6 p-4">
            {/* 左侧活动列表 */}
            <div className="md:w-1/3 w-full">
                <h2 className="text-xl font-bold mb-4 text-green-700">可报名活动</h2>
                <div className="space-y-2">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`border p-3 rounded cursor-pointer hover:bg-green-50 ${
                                selectedActivity?.id === activity.id ? 'border-green-500 bg-green-50' : ''
                            }`}
                            onClick={() => setSelectedActivity(activity)}
                        >
                            <h3 className="font-semibold">{activity.activityName}</h3>
                            <p className="text-sm text-gray-600">场馆：{activity.venueName}</p>
                            <p className="text-sm text-gray-500">时间：{formatTime(activity.eventTime)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 右侧活动详情 */}
            <div className="md:w-2/3 w-full">
                {selectedActivity ? (
                    <div className="border rounded p-4 shadow bg-white">
                        <img
                            src={selectedActivity.imageUrl}
                            alt={selectedActivity.activityName}
                            className="w-full h-64 object-cover rounded mb-4"
                        />
                        <h2 className="text-2xl font-bold mb-2">{selectedActivity.activityName}</h2>
                        <p className="text-gray-600 mb-1">场馆：{selectedActivity.venueName}</p>
                        <p className="text-gray-600 mb-1">
                            活动时间：{formatTime(selectedActivity.eventTime)}
                        </p>
                        <p className="text-gray-600 mb-1">
                            报名时间：{formatTime(selectedActivity.startRegistrationTime)} ~{' '}
                            {formatTime(selectedActivity.endRegistrationTime)}
                        </p>
                        <p className="text-gray-700 mt-4 mb-6">{selectedActivity.description}</p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={handleSignup}
                        >
                            我要报名
                        </button>
                    </div>
                ) : (
                    <p>请选择一个活动查看详情</p>
                )}
            </div>
        </div>
    );
}
