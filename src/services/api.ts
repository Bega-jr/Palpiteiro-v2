const API_URL =
import.meta.env.VITE_BACKEND_URL ||
import.meta.env.VITE_API_URL ||
"[http://localhost:5000](http://localhost:5000)";

export default {
get: async (path: string) => {
const res = await fetch(API_URL + path, {
method: "GET",
headers: {
"Content-Type": "application/json",
},
});
return res.json();
},

post: async (path: string, body: any) => {
const res = await fetch(API_URL + path, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(body),
});
return res.json();
},
};
