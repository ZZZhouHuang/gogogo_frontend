import React, { useState } from 'react';
import VenueSelector from "../components/VenueSelector.jsx";

export default function CreateActivities() {
    const [form, setForm] = useState({
        activityName: '',
        venueName: '',
        description: '',
        imageUrl: '',
        eventTime: '',
        startRegistrationTime: '',
        endRegistrationTime: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // 时间格式转换：local -> yyyyMMddHHmmss
    function formatToBackendTime(localDatetimeStr) {
        const dt = new Date(localDatetimeStr);
        const yyyy = dt.getFullYear();
        const MM = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        const HH = String(dt.getHours()).padStart(2, '0');
        const mm = String(dt.getMinutes()).padStart(2, '0');
        const ss = String(dt.getSeconds()).padStart(2, '0');
        return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
    }

    // 图片预览
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // 上传图片
    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('file', imageFile);

        const res = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        if (result.code === '200') {
            return result.data;
        } else {
            throw new Error(result.msg || '上传失败');
        }
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 时间校验
        const start = new Date(form.startRegistrationTime);
        const end = new Date(form.endRegistrationTime);
        const event = new Date(form.eventTime);
        if (start >= end || end >= event) {
            alert("时间顺序错误：请确保 报名开始 < 报名结束 < 活动时间");
            return;
        }

        try {
            let imageUrl = form.imageUrl;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const payload = {
                activityName: form.activityName,
                venueName: form.venueName,
                description: form.description,
                imageUrl,
                eventTime: formatToBackendTime(form.eventTime),
                startRegistrationTime: formatToBackendTime(form.startRegistrationTime),
                endRegistrationTime: formatToBackendTime(form.endRegistrationTime),
            };

            const res = await fetch('http://localhost:8080/api/activity/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.code === '200') {
                alert('创建成功');
                setForm({
                    activityName: '',
                    venueName: '',
                    description: '',
                    imageUrl: '',
                    eventTime: '',
                    startRegistrationTime: '',
                    endRegistrationTime: ''
                });
                setImageFile(null);
                setPreviewUrl('');
            } else {
                alert('创建失败: ' + result.msg);
            }
        } catch (err) {
            alert('错误: ' + err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-green-700">创建新活动</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="活动名称"
                    className="w-full border p-2 rounded"
                    value={form.activityName}
                    onChange={(e) => setForm({ ...form, activityName: e.target.value })}
                    required
                />

                <VenueSelector
                    value={form.venueName}
                    onChange={(val) => setForm({ ...form, venueName: val })}
                />

                <textarea
                    placeholder="活动简介"
                    className="w-full border p-2 rounded"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <label className="block text-sm font-medium text-gray-600">活动时间</label>
                <input
                    type="datetime-local"
                    className="w-full border p-2 rounded"
                    value={form.eventTime}
                    onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                    required
                />

                <label className="block text-sm font-medium text-gray-600">报名开始时间</label>
                <input
                    type="datetime-local"
                    className="w-full border p-2 rounded"
                    value={form.startRegistrationTime}
                    onChange={(e) => setForm({ ...form, startRegistrationTime: e.target.value })}
                    required
                />

                <label className="block text-sm font-medium text-gray-600">报名截止时间</label>
                <input
                    type="datetime-local"
                    className="w-full border p-2 rounded"
                    value={form.endRegistrationTime}
                    onChange={(e) => setForm({ ...form, endRegistrationTime: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">上传封面图</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="预览图"
                            className="mt-2 h-40 object-cover rounded border"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    提交
                </button>
            </form>
        </div>
    );
}
