import axios from "axios";

// const backend_url = "http://127.0.0.1:8080/"
const backend_url = "http://localhost:3000/"

export const getImages = async () => {
    try {
        const res = await axios.get(backend_url);
        return res.data;
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const getImageById = async (id) => {
    try {
        const res = await axios.get(backend_url + id);
        return res.data;
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const postImage = async (formData) => {
    try {
        const data = await axios.post(backend_url, formData)
        return data;
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const deleteImage = async (body) => {
    try {
        const deleted = await axios.delete(body);
        return deleted
    } catch (e) {
        console.error(e);
        return e;
    }
}