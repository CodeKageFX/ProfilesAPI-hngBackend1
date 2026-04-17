"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = createProfile;
exports.getAllProfiles = getAllProfiles;
exports.getProfileById = getProfileById;
exports.deleteProfileById = deleteProfileById;
const ProfileServices = __importStar(require("../services/profiles.service"));
const helpers_1 = require("../lib/helpers");
const prisma_1 = require("../lib/prisma");
const uuid_1 = require("uuid");
async function createProfile(req, res) {
    try {
        const { name } = req.body;
        if (name === undefined || name === null || name === "") {
            res.status(400).json({
                status: "error",
                message: "Name is required"
            });
            return;
        }
        if (typeof name !== "string") {
            res.status(422).json({
                status: "error",
                message: "Name must be a string"
            });
            return;
        }
        const query = name.toLowerCase().trim();
        const existingProfile = await prisma_1.prisma.profile.findUnique({
            where: { name: query }
        });
        if (existingProfile) {
            res.status(200).json({
                status: "success",
                message: "Profile already exists",
                data: existingProfile
            });
            return;
        }
        const [gender, age, nationality] = await Promise.all([
            (0, helpers_1.genderApi)(query),
            (0, helpers_1.ageApi)(query),
            (0, helpers_1.nationalityApi)(query)
        ]);
        if (!nationality.country || nationality.country.length === 0) {
            res.status(502).json({
                status: "error",
                message: "Nationalize returned an invalid response"
            });
            return;
        }
        if (!age.age) {
            res.status(502).json({
                status: "error",
                message: "Agify returned an invalid reponse"
            });
            return;
        }
        if (!gender.gender) {
            res.status(502).json({
                status: "error",
                message: "Genderized returned an invalid reponse"
            });
            return;
        }
        const topCountry = nationality.country.reduce((max, current) => (max.probability > current.probability) ? max : current);
        const country_probability = Number(topCountry.probability.toFixed(2));
        const newProfile = await ProfileServices.createProfile({
            id: (0, uuid_1.v7)(),
            name: query,
            gender: gender.gender,
            gender_probability: gender.probability,
            sample_size: gender.count,
            age: age.age,
            age_group: age.age ? (age.age <= 12 ? "child" : age.age <= 19 ? "teenager" : age.age <= 59 ? "adult" : "senior") : "unknown",
            country_id: topCountry.country_id,
            country_probability
        });
        res.status(201).json({
            status: "success",
            data: newProfile
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create profile",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
async function getAllProfiles(req, res) {
    try {
        const { gender, age_group, country_id } = req.query;
        const profiles = await ProfileServices.getAllProfiles(gender, age_group, country_id);
        res.status(200).json({
            status: "success",
            count: profiles.length,
            data: profiles
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get profiles",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
async function getProfileById(req, res) {
    try {
        const { id } = req.params;
        const profile = await ProfileServices.getProfileById(id);
        if (!profile) {
            res.status(404).json({
                status: "error",
                message: "Profile not found"
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get profile",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
async function deleteProfileById(req, res) {
    try {
        const { id } = req.params;
        const deleteProfile = await ProfileServices.deleteProfileById(id);
        if (!deleteProfile) {
            res.status(404).json({
                status: "error",
                message: "ID not found"
            });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to delete profile",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
