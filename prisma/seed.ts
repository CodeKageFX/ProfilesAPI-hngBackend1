import "dotenv/config"

import { v7 as uuidv7 } from "uuid";
import data from "./seed_profiles.json"
import { prisma } from "../src/lib/prisma.js";


async function main() {
    console.log("Seeding database...");

        const profiles = data.profiles.map(profile =>({
            id: uuidv7(),
            name: profile.name,
            gender: profile.gender,
            gender_probability: profile.gender_probability,
            age: profile.age,
            age_group: profile.age_group,
            country_id: profile.country_id,
            country_name: profile.country_name,
            country_probability: profile.country_probability,
            sample_size: 0,
        }))
        await prisma.profile.createMany({
            data: profiles,
            skipDuplicates: true,
        });
    console.log("Database seeded successfully.");
}

main()
    .catch(console.error)
    .finally(()=> prisma.$disconnect());