import React, { useEffect, useState } from 'react';

export default function ManageActivities() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    // 获取活动列表
    const fetchActivities = () => {
        fetch('http://localhost:8080/api/activity/all')
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
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const formatTime = (ts) => {
        if (!ts) return '';
        const str = ts.toString();
        return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)} ${str.slice(8, 10)}:${str.slice(10, 12)}`;
    };

    const handleDelete = async () => {
        if (!selectedActivity) return;
        if (!window.confirm(`确定要删除活动「${selectedActivity.activityName}」吗？`)) return;

        try {
            const res = await fetch(`http://localhost:8080/api/activity/${selectedActivity.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.code === '200') {
                alert('活动删除成功');
                const updated = activities.filter((act) => act.id !== selectedActivity.id);
                setActivities(updated);
                setSelectedActivity(updated[0] || null);
            } else {
                alert('删除失败：' + data.msg);
            }
        } catch (error) {
            console.error('删除出错:', error);
            alert('删除失败');
        }
    };

    const handleEdit = () => {
        if (!selectedActivity) return;
        setFormData({ ...selectedActivity }); // 初始化编辑表单
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/activity/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.code === '200') {
                alert('修改成功');
                setIsEditing(false);
                fetchActivities();
            } else {
                alert('修改失败: ' + data.msg);
            }
        } catch (err) {
            console.error('修改出错:', err);
            alert('修改失败');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (loading) return <p className="p-4">加载中...</p>;

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-6 p-4">
            {/* 左侧活动列表 */}
            <div className="md:w-1/3 w-full">
                <h2 className="text-xl font-bold mb-4 text-green-700">活动管理</h2>
                <div className="space-y-2">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`border p-3 rounded cursor-pointer hover:bg-green-50 ${
                                selectedActivity?.id === activity.id ? 'border-green-500 bg-green-50' : ''
                            }`}
                            onClick={() => {
                                setSelectedActivity(activity);
                                setIsEditing(false); // 切换活动时退出编辑模式
                            }}
                        >
                            <h3 className="font-semibold">{activity.activityName}</h3>
                            <p className="text-sm text-gray-600">场馆：{activity.venueName}</p>
                            <p className="text-sm text-gray-500">时间：{formatTime(activity.eventTime)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 右侧活动详情 / 编辑表单 */}
            <div className="md:w-2/3 w-full">
                {selectedActivity ? (
                    <div className="border rounded p-4 shadow bg-white">
                        {isEditing ? (
                            // 正在编辑状态
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    name="activityName"
                                    placeholder="活动名称"
                                    value={formData.activityName}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded"
                                />

                                <input
                                    type="text"
                                    name="venueName"
                                    placeholder="场馆名称"
                                    value={formData.venueName}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded"
                                />

                                <textarea
                                    name="description"
                                    placeholder="活动描述"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded"
                                    rows={3}
                                />

                                <label className="block text-sm text-gray-600">活动时间</label>
                                <input
                                    type="datetime-local"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded"
                                />

                                <label className="block text-sm text-gray-600">报名开始时间</label>
                                <input
                                    type="datetime-local"
                                    name="startRegistrationTime"
                                    value={formData.startRegistrationTime}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded"
                                />

                                <label className="block text-sm text-gray-600">报名截止时间</label>
                                <input
                                    type="datetime-local"
                                    name="endRegistrationTime"
                                    value={formData.endRegistrationTime}
                                    onChange={handleInputChange}
                                    className="w-full border p-2 rounded"
                                />

                                <label className="block text-sm text-gray-600">活动封面图</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData(prev => ({
                                                ...prev,
                                                newImageFile: file,
                                            }));
                                            setFormData(prev => ({
                                                ...prev,
                                                previewImage: URL.createObjectURL(file),
                                            }));
                                        }
                                    }}
                                />

                                {formData.previewImage ? (
                                    <img src={formData.previewImage} className="h-40 object-cover rounded mt-2" />
                                ) : (
                                    <img src={formData.imageUrl} className="h-40 object-cover rounded mt-2" />
                                )}

                                <div className="flex gap-4 mt-4">
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        onClick={handleUpdate}
                                    >
                                        保存修改
                                    </button>
                                    <button
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                        onClick={handleCancelEdit}
                                    >
                                        取消
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // 非编辑状态：活动详情展示
                            <>
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
                                <div className="flex gap-4">
                                    <button
                                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                        onClick={handleEdit}
                                    >
                                        修改信息
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        onClick={handleDelete}
                                    >
                                        删除活动
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p>请选择一个活动查看详情</p>
                )}

            </div>
        </div>
    );
}
