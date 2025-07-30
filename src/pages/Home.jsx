import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
            style={{
                backgroundImage: "url('/bg1.jpg')",
            }}
        >
            <div className="bg-white/80 backdrop-blur-md px-8 py-16 rounded-3xl shadow-2xl border border-blue-100 max-w-md w-full">
                <h1 className="text-5xl font-extrabold text-blue-500 mb-6 drop-shadow-lg tracking-wide text-center">
                    Gogogo!
                </h1>
                <p className="text-gray-600 text-lg mb-10 text-center">
                    欢迎使用体育预约系统！<br />
                    请先登录或注册以体验完整功能。
                </p>
                <div className="flex justify-center gap-8">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 font-semibold text-lg rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
                    >
                        登录
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-6 py-2 font-semibold text-lg rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all duration-200"
                    >
                        注册
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;