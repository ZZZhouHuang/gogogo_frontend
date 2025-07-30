import React, { useEffect, useState } from 'react';

export default function MyActivities() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("请先登录！");
            return;
        }

        fetch("http://localhost:8080/api/activity/myActivity", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "200") {
                    setActivities(data.data);
                    setSelectedActivity(data.data[0] || null);
                } else {
                    alert("获取活动失败：" + data.msg);
                }
            })
            .catch((err) => {
                console.error("加载失败:", err);
                alert("加载失败");
            })
            .finally(() => setLoading(false));
    }, []);

    // 解析时间戳或字符串
    const formatTime = (ts) => {
        if (!ts) return '';
        let date;
        if (typeof ts === 'object' && ts.time) {
            date = new Date(ts.time);
        } else if (typeof ts === 'string' && /^\d{14}$/.test(ts)) {
            const y = ts.slice(0, 4);
            const m = ts.slice(4, 6) - 1;
            const d = ts.slice(6, 8);
            const H = ts.slice(8, 10);
            const M = ts.slice(10, 12);
            const S = ts.slice(12, 14);
            date = new Date(y, m, d, H, M, S);
        } else {
            date = new Date(ts);
        }
        if (isNaN(date.getTime())) return '';
        return date.toLocaleString();
    };

    // 判断活动是否已结束
    const isActivityEnded = (activity) => {
        if (!activity?.eventTime) return false;
        let endTime = null;
        if (typeof activity.eventTime === 'object' && activity.eventTime.time) {
            endTime = activity.eventTime.time;
        } else if (typeof activity.eventTime === 'string' && /^\d{14}$/.test(activity.eventTime)) {
            const y = activity.eventTime.slice(0, 4);
            const m = activity.eventTime.slice(4, 6) - 1;
            const d = activity.eventTime.slice(6, 8);
            const H = activity.eventTime.slice(8, 10);
            const M = activity.eventTime.slice(10, 12);
            const S = activity.eventTime.slice(12, 14);
            endTime = new Date(y, m, d, H, M, S).getTime();
        } else {
            endTime = new Date(activity.eventTime).getTime();
        }
        return endTime < Date.now();
    };

    // 获取指定活动的评论
    const fetchComments = async (activityId) => {
        if (!activityId) return;
        setCommentLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/comment/${activityId}`);
            const data = await res.json();
            if (data.code === '200') {
                setComments(data.data || []);
            } else {
                setComments([]);
            }
        } catch (e) {
            setComments([]);
        }
        setCommentLoading(false);
    };

    // 当选中活动变化时，加载评论（仅已结束活动才显示评论）
    useEffect(() => {
        if (selectedActivity && isActivityEnded(selectedActivity)) {
            fetchComments(selectedActivity.id);
        } else {
            setComments([]);
        }
        setCommentInput('');
    }, [selectedActivity]);

    const handleCancel = async () => {
        if (!selectedActivity) return;

        if (!window.confirm("确定要取消报名该活动吗？")) return;

        try {
            const res = await fetch('http://localhost:8080/api/activity/cancel', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ activityId: selectedActivity.id }),
            });

            const data = await res.json();

            if (data.code === '200') {
                alert("取消报名成功！");
                // 更新活动列表和当前选中项
                const updated = activities.filter(act => act.id !== selectedActivity.id);
                setActivities(updated);
                setSelectedActivity(updated[0] || null);
            } else {
                alert("取消失败：" + data.msg);
            }
        } catch (error) {
            console.error("取消报名出错:", error);
            alert("取消失败");
        }
    };

    // 发表评论
    const handleCommentSubmit = async () => {
        if (!commentInput.trim()) {
            alert("评论内容不能为空！");
            return;
        }
        if (!selectedActivity) return;
        setCommentLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    activityId: selectedActivity.id,
                    content: commentInput.trim(),
                }),
            });
            const data = await res.json();
            if (data.code === '200') {
                setCommentInput('');
                // 评论成功后刷新评论列表
                fetchComments(selectedActivity.id);
            } else {
                alert("评论失败：" + data.msg);
            }
        } catch (e) {
            alert("评论失败");
        }
        setCommentLoading(false);
    };

    if (loading) return <p className="p-4">加载中...</p>;

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-6 p-4">
            {/* 左侧我的活动列表 */}
            <div className="md:w-1/3 w-full">
                <h2 className="text-xl font-bold mb-4 text-green-700">我报名的活动</h2>
                <div className="space-y-2">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`border p-3 rounded cursor-pointer hover:bg-green-50
                                ${selectedActivity?.id === activity.id ? 'border-green-500 bg-green-50' : ''}
                                ${isActivityEnded(activity) ? 'bg-gray-100 opacity-80' : ''}`
                            }
                            onClick={() => setSelectedActivity(activity)}
                        >
                            <h3 className="font-semibold">{activity.activityName}</h3>
                            <p className="text-sm text-gray-600">场馆：{activity.venueName}</p>
                            <p className="text-sm text-gray-500">时间：{formatTime(activity.eventTime)}</p>
                            {isActivityEnded(activity) && (
                                <span className="inline-block text-xs bg-gray-400 text-white px-2 py-0.5 rounded ml-2">已结束</span>
                            )}
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
                        <p className="text-gray-600 mb-1">活动时间：{formatTime(selectedActivity.eventTime)}</p>
                        <p className="text-gray-700 mt-4 mb-6">{selectedActivity.description}</p>
                        {isActivityEnded(selectedActivity) ? (
                            <>
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">活动评论</h3>
                                    {commentLoading ? (
                                        <div className="text-gray-400">评论加载中...</div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto mb-2">
                                            {comments.length === 0 ? (
                                                <div className="text-gray-400">暂无评论</div>
                                            ) : (
                                                comments.map(comment => (
                                                    <div key={comment.id} className="border-b pb-1">
                                                        <span className="text-green-700 font-medium">{comment.userName || `用户${comment.userId}`}</span>
                                                        <span className="ml-2 text-xs text-gray-400">{formatTime(comment.createTime)}</span>
                                                        <div className="ml-1 mt-1 text-gray-700">{comment.content}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* 评论输入框 */}
                                <div className="flex items-start gap-2">
                                    <textarea
                                        className="border rounded w-full p-2 resize-none"
                                        rows={2}
                                        placeholder="请输入评论内容"
                                        value={commentInput}
                                        onChange={e => setCommentInput(e.target.value)}
                                        disabled={commentLoading}
                                    />
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        onClick={handleCommentSubmit}
                                        disabled={commentLoading}
                                    >
                                        发布
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleCancel}
                            >
                                取消报名
                            </button>
                        )}
                    </div>
                ) : (
                    <p>请选择一个活动查看详情</p>
                )}
            </div>
        </div>
    );
}