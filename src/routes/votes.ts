import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Vote } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

export default router;
