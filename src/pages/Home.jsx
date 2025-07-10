import { useNavigate} from "react-router-dom";


function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
                 style={{ backgroundImage: "url('/bg1.jpg')" }}>
                <div className="text-center p-16 bg-white rounded-xl shadow-lg">
                    <h1 className="text-4xl font-bold text-blue-400 mb-4">体育预约系统</h1>
                    {/*<p className="text-gray-600 text-lg">TailwindCSS & React 设置成功！</p>*/}
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={()=>navigate("/login")}
                            className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-400 transition">
                            登录
                        </button>
                        <button
                            onClick={()=>navigate("/register")}
                            className= "px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-400 transition">
                            注册
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home

