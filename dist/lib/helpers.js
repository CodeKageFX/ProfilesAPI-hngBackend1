"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genderApi = genderApi;
exports.ageApi = ageApi;
exports.nationalityApi = nationalityApi;
async function genderApi(name) {
    const response = await fetch(`https://api.genderize.io?name=${name}`);
    const data = await response.json();
    return data;
}
async function ageApi(name) {
    const response = await fetch(`https://api.agify.io?name=${name}`);
    const data = await response.json();
    return data;
}
async function nationalityApi(name) {
    const response = await fetch(`https://api.nationalize.io?name=${name}`);
    const data = await response.json();
    return data;
}
