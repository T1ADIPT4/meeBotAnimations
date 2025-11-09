import React from "react";

export default function Auth() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">เข้าสู่ระบบ Contributor</h2>
            <input type="text" placeholder="Wallet address หรือ Email" className="mt-2 p-2 border" />
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">เข้าสู่ระบบ</button>
        </div>
    );
}
