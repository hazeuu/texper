import "../Home.css"
import React from "react";
import Sliderbanner from "../components/sliderbanner";
import { useNavigate, Link } from "react-router-dom";
export default function Home(){
    const navigate= useNavigate();
    return(
        <>
        <Sliderbanner/>
        <div className="format_Home">
            <h1>BỆNH VIỆN PHỤ SẢN TRUNG ƯƠNG</h1>
            <h2>Trao nhân ái, trí tuệ vì hạnh phúc, tương lai</h2>
        </div>
        </>
    )
}