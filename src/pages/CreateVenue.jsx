import React, { useState } from 'react';

export default function CreateVenue() {
    const [form, setForm] = useState({
        venueName: '',
        location: '',
        description: '',
        imageUrl: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // 预览图片
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // 上传图片到 OSS（假设后端提供接口 /api/upload）
    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('file', imageFile);

        const res = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        if (result.code === '200') {
            return result.data; // imageUrl
        } else {
            throw new Error(result.msg || '上传失败');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = form.imageUrl;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const payload = { ...form, imageUrl };
            const res = await fetch('http://localhost:8080/api/venue/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.code === '200') {
                alert('创建成功');
                setForm({ name: '', location: '', description: '', imageUrl: '' });
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
        <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-green-700">添加新场馆</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="场馆名称"
                    className="w-full border p-2 rounded"
                    value={form.venueName}
                    onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="地点"
                    className="w-full border p-2 rounded"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                />
                <textarea
                    placeholder="简介"
                    className="w-full border p-2 rounded"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">上传封面图：</label>
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
