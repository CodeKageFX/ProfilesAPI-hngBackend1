export async function genderApi(name: string) {
    const response = await fetch(`https://api.genderize.io?name=${name}`);
    const data = await response.json();
    return data;
}

export async function ageApi(name: string) {
    const response = await fetch(`https://api.agify.io?name=${name}`);
    const data = await response.json();
    return data;
}

export async function nationalityApi(name: string) {
    const response = await fetch(`https://api.nationalize.io?name=${name}`);
    const data = await response.json();
    return data;
}