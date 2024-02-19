import { Router } from "express";
import {
  searchEmployees,
  searchServices,
} from "../controllers/searchController.js";

const router = Router();

// Endpoint pour la recherche de services
router.post("/search/services", async (req, res) => {
  try {
    const { query } = req.body;

    const services = await searchServices(query);
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint pour la recherche d'employés par nom
router.get("/employees/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const employees = await searchEmployees(query);
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
