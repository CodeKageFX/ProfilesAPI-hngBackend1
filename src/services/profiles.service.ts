import { prisma } from "../lib/prisma.js";
// import uuid

export async function createProfile(data: {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  sample_size: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
}) {
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
      country_name: data.country_name,
      country_probability: data.country_probability,
    },
  });
}

export async function getAllProfiles(
  gender?: string,
  age_group?: string,
  country_id?: string,
  min_age?: number,
  max_age?: number,
  min_gender_probability?: number,
  min_country_probability?: number,

  sort_by:
    | "age"
    | "created_at"
    | "gender_probability"
    | "country_probability" = "created_at",
  order: "asc" | "desc" = "desc",

  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * Math.min(limit, 50);
  const take = Math.min(limit, 50);

  const where = {
    gender: gender
      ? { equals: gender, mode: "insensitive" as const }
      : undefined,
    age_group: age_group
      ? { equals: age_group, mode: "insensitive" as const }
      : undefined,
    country_id: country_id
      ? { equals: country_id, mode: "insensitive" as const }
      : undefined,

    age: {
      gte: min_age,
      lte: max_age,
    },
    gender_probability: {
      gte: min_gender_probability,
    },
    country_probability: {
      gte: min_country_probability,
    },
  };

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy: {
        [sort_by]: order,
      },
      skip,
      take,
    }),
    prisma.profile.count({ where }),
  ]);

  return { profiles, total };
}

export async function getProfileById(id: string) {
  return await prisma.profile.findUnique({
    where: { id },
  });
}

export async function deleteProfileById(id: string) {
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) {
    throw new Error("Profile doesn't exist");
  }

  return await prisma.profile.delete({
    where: { id },
  });
}
