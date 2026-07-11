import axios from "axios";

const api = axios.create({
  baseURL: "https://paper-ai-5t5i.onrender.com",
  withCredentials: true,
})

export async function registerUser({username , email, password}) {
console.log("hit");

const response = await api.post("/api/auth/register", {username, email, password})
return response.data

}

export async function resendEmailVerification({email}) {
  const response = await api.post("/api/auth/resend-email-verification", {
    email,
  });
  return response.data
}

export async function loginUser({email, password}) {

  const response = await api.post("/api/auth/login", {email, password})
  return response.data
}

export async function getMe(){
  const response = await api.get("/api/auth/get-me")
  return response.data
}

export async function logoutUser(){
  const response = await api.post("/api/auth/logout")
  return response.data
}
