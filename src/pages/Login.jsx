import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    // // 预设的测试账号
    // const testAccount = {
    //     username: "admin",
    //     password: "123456"
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            alert("请填写所有字段");
            return;
        }
        console.log("登录信息：", form);
        // TODO: 发送登录请求

        // // 检查是否匹配预设账号
        // if (form.username === testAccount.username && form.password === testAccount.password) {
        //     console.log("登录成功，跳转到仪表盘");
        //     navigate("/dashboard"); // 跳转到仪表盘页面
        // } else {
        //     alert("用户名或密码错误");
        // }
        try {
            const res = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (result.code === "200") {
                // 登录成功，保存 token
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("role", result.data.role);
                alert("登录成功！");
                navigate("/dashboard");
            } else {
                alert("登录失败：" + result.msg);
            }
        } catch (err) {
            console.error("请求出错", err);
            alert("网络错误或服务器未启动");
        }

    };

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">登录</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="用户名"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="密码"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        登录
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    没有账号？<Link to="/register" className="text-blue-600 hover:underline">去注册</Link>
                </p>
            </div>
        </div>
    );
}
