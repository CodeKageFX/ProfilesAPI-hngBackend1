import { prisma } from "../lib/prisma";
// import uuid

export async function createProfile(
    data: {
        id: string
        name: string;
        gender: string;
        gender_probability: number;
        sample_size: number;
        age: number;
        age_group: string;
        country_id: string;
        country_probability: number;
    }
) {
    return await prisma.profile.create({
        data: {
            id: data.id,
            name: data.name,
            gender: data.gender,
            gender_probability: data.gender_probability,
            sample_size: data.sample_size,
            age: data.age,
            age_group: data.age_group,
            country_id: data.country_id,
            country_probability: data.country_probability
        }
    })
}

export async function getAllProfiles(
    gender?: string,
    age_group?: string,
    country_id?: string
) {
    return await prisma.profile.findMany({
        where: {
            gender: gender ? { equals: gender, mode: 'insensitive' } : undefined,
            age_group: age_group ? { equals: age_group, mode: 'insensitive' } : undefined,
            country_id: country_id ? { equals: country_id, mode: 'insensitive' } : undefined,
        }
    })
}

export async function getProfileById(id: string) {
    return await prisma.profile.findUnique({
        where: { id }
    })
}

export async function deleteProfileById(id: string) {
    const profile = await prisma.profile.findUnique({where: {id}})
    if(!profile) {
        throw new Error("Profile doesn't exist")
    }
    
    return await prisma.profile.delete({
        where: { id }
    })
}