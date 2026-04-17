import * as ProfileServices from "../services/profiles.service.js";
import { Request, Response } from "express";
import { genderApi, ageApi, nationalityApi } from "../lib/helpers.js";
import { prisma } from "../lib/prisma.js";
import { v7 as uuidv7 } from 'uuid';

export async function createProfile(req: Request, res: Response) {
    try {
        const { name } = req.body

        if(name === undefined || name === null || name === "") {
            res.status(400).json({
                status: "error",
                message: "Name is required"
            })

            return
        }

        if(typeof name !== "string") {
            res.status(422).json({
                status: "error",
                message: "Name must be a string"
            })
            return
        }

        const query = name.toLowerCase().trim()

        const existingProfile = await prisma.profile.findUnique({
            where: { name: query }
        })

        if(existingProfile) {
            res.status(200).json({
                status: "success",
                message: "Profile already exists",
                data: existingProfile
            })

            return
        }

        const [gender, age, nationality] = await Promise.all([
            genderApi(query),
            ageApi(query),
            nationalityApi(query)
        ]) as [
            { gender: string; probability: number; count: number },
            { age: number | null },
            { country: Array<{ country_id: string; probability: number }> | null }
        ]


        if(!nationality.country || nationality.country.length === 0) {
            res.status(502).json({
                status: "error",
                message: "Nationalize returned an invalid response"
            })
            return
        }

        if(!age.age) {
            res.status(502).json({
                status: "error",
                message: "Agify returned an invalid reponse"
            })
            return
        }

        if(!gender.gender) {
            res.status(502).json({
                status: "error",
                message: "Genderized returned an invalid reponse"
            })
            return
        }


        const topCountry = nationality.country.reduce((max, current) => (max.probability > current.probability) ? max : current)
        const country_probability = Number(topCountry.probability.toFixed(2))


        const newProfile = await ProfileServices.createProfile({
            id: uuidv7(),
            name: query,
            gender: gender.gender,
            gender_probability: gender.probability,
            sample_size: gender.count,
            age: age.age,
            age_group: age.age ? (age.age <= 12 ? "child" : age.age <= 19 ? "teenager" : age.age <= 59 ? "adult" : "senior") : "unknown",
            country_id: topCountry.country_id,
            country_probability
        })

        res.status(201).json({
            status: "success",
            data: newProfile
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create profile",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export async function getAllProfiles(req: Request, res: Response) {
    try {
        const {  gender, age_group, country_id } = req.query

        const profiles = await ProfileServices.getAllProfiles(
            gender as string | undefined,
            age_group as string | undefined,
            country_id as string | undefined
        )

        res.status(200).json({
            status: "success",
            count: profiles.length,
            data: profiles
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get profiles",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export async function getProfileById(req: Request, res: Response) {
    try {
        const { id } = req.params

        const profile = await ProfileServices.getProfileById(id as string)

        if(!profile) {
            res.status(404).json({
                status: "error",
                message: "Profile not found"
            })
            return
        }

        res.status(200).json({
            status: "success",
            data: profile
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get profile",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export async function deleteProfileById(req: Request, res: Response) {
    try {
        const { id } = req.params

        const deleteProfile = await ProfileServices.deleteProfileById(id as string)
        if(!deleteProfile) {
            res.status(404).json({
                status: "error",
                message: "ID not found"
            })


            return
        }

        res.status(204).send()
    }

    catch(error) {
        res.status(500).json({
            status: "error",
            message: "Failed to delete profile",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}