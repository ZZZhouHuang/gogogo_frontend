import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({ role:"user",username: "", password: "", confirm: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password || !form.confirm) {
            alert("请填写所有字段");
            return;
        }
        if (form.password !== form.confirm) {
            alert("两次输入的密码不一致");
            return;
        }
        console.log("注册信息：", form);
        // TODO: 发送注册请求

        try {
            const res = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                    role: form.role
                })
            });

            const result = await res.json();
            if (result.code === "200") {
                alert("注册成功！");
                navigate("/login"); // 跳转到登录页
            } else {
                alert(result.msg || "注册失败");
            }
        } catch (err) {
            console.error("注册请求失败", err);
            alert("连接服务器失败");
        }
    };

    return (
        <div className="min-h-screen bg-green-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">注册</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500 bg-white"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                    </select>
                    <input
                        type="text"
                        placeholder="用户名"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="密码"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="确认密码"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500"
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        注册
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    已有账号？<Link to="/login" className="text-green-600 hover:underline">去登录</Link>
                </p>
            </div>
        </div>
    );
}
