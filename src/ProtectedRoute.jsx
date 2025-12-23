import { useContext } from "react";
import { Navigate } from "react-router-dom";
import {AuthContext} from "./pages/internal/jsx/AuthContext";

function ProtectedRoute ({Children})
{
    const {isLoggedIn}=useContext(AuthContext);
    if (!isLoggedIn){
        return <Navigate to="/login" replace />
    }
    
    return Children;
}
export default ProtectedRoute