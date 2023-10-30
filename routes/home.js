import express from "express"
import { mynyumbaApiDocumentation } from "../controllers/home/documentations.js"

const router = express.Router()

router.get('/', mynyumbaApiDocumentation)

export default router