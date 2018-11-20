import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
	response.status(200).json({ namn: "Fulup", Age: 8 });
});

export default router;
