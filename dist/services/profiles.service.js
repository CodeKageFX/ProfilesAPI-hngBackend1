"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = createProfile;
exports.getAllProfiles = getAllProfiles;
exports.getProfileById = getProfileById;
exports.deleteProfileById = deleteProfileById;
const prisma_1 = require("../lib/prisma");
// import uuid
async function createProfile(data) {
    return await prisma_1.prisma.profile.create({
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
    });
}
async function getAllProfiles(gender, age_group, country_id) {
    return await prisma_1.prisma.profile.findMany({
        where: {
            gender: gender ? { equals: gender, mode: 'insensitive' } : undefined,
            age_group: age_group ? { equals: age_group, mode: 'insensitive' } : undefined,
            country_id: country_id ? { equals: country_id, mode: 'insensitive' } : undefined,
        }
    });
}
async function getProfileById(id) {
    return await prisma_1.prisma.profile.findUnique({
        where: { id }
    });
}
async function deleteProfileById(id) {
    const profile = await prisma_1.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
        throw new Error("Profile doesn't exist");
    }
    return await prisma_1.prisma.profile.delete({
        where: { id }
    });
}
