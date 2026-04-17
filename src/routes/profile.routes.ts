import * as ProfileControllers from "../controller/profile.controller.js"
import { Router } from "express"

const profile_router = Router()

profile_router.post("/profiles", ProfileControllers.createProfile)
profile_router.get("/profiles", ProfileControllers.getAllProfiles)
profile_router.get("/profiles/:id", ProfileControllers.getProfileById)

profile_router.delete("/profiles/:id", ProfileControllers.deleteProfileById)
export default profile_router