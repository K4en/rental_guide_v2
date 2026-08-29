const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(userEmail, userPassword){
        console.log("Login button clicked")

        const response = await fetch(
            `${API_URL}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword
                })
                });
        if (!response.ok) {
            throw new Error("Login failed");
        }
        return await response.json();

}

export async function registerUser(userEmail, userPassword){
        console.log("Register button clicked")

        const response = await fetch(
            `${API_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword
                })
                });
                return await response.json();
}

export async function createProperty(name, address){
        const token = localStorage.getItem("token");
        const response = await fetch(
        `${API_URL}/properties`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                    },
                body: JSON.stringify({
                    name: name,
                    address: address
                })
                });
            return await response.json();
}

export async function loadProperty(property_id){
console.log("property_id:", property_id);
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/properties/${property_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                    },

                });
        return await response.json();
}

export async function loadGuide(property_id){

    const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/properties/${property_id}/guide-content`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                    },

                });
        return await response.json();
}

export async function createGuide(property_id, data){
        const token = localStorage.getItem("token");
        const response = await fetch(
        `${API_URL}/guides/${property_id}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                    },
                body:
                    JSON.stringify(data)
                });
            return await response.json();
}

export async function updateGuide(property_id, data){
    const token = localStorage.getItem("token");
    const response = await fetch(
    `${API_URL}/guides/${property_id}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                    },
                body:
                    JSON.stringify(data)
                });
    return await response.json();
}

export async function deleteGuide(property_id){
    const token = localStorage.getItem("token");
    const response = await fetch(
    `${API_URL}/guides/${property_id}`,{
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                    }})
    return await response.json();
}

export async function checkAuth(){
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    try{
        const response = await fetch(
        `${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok){
            localStorage.removeItem("token");
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        return false;
    }
}

export async function loadPublicGuide(property_id){

        const response = await fetch(
            `${API_URL}/public/properties/${property_id}/guide-content`
            );
        return await response.json();
}