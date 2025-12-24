import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUserDetails } from "./features/userSlice";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const GoogleAuthentication = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const responseGoogle = async (authResult) => {
		try {
			const code = authResult.code;
			console.log("Google auth code:", code);
            console.log('error in url in post ')
			const result = await axios.post(`${API_BASE}/api/auth/google`, { code });
            // console.log(result)
			const { email, fullName} = result.data.user;
			const token = result.data.token;

			const obj = { email, fullName, token };	
			// Save to Redux
		
		dispatch(setUserDetails(obj))

			// Navigate to dashboard
			 navigate('/createroom')
		} catch (e) {
			console.log('Error while Google Login...', e);
		}
	};

	const handleGoogleError = (error) => {
		console.log("Google Login Failed", error);
		alert("Google login failed");
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: handleGoogleError,
		flow: "auth-code",
	});

	return (
		<div className="App">
			<button onClick={googleLogin}>
				Sign in with Google
			</button>	
		</div>
	);
};
