import { logging } from "../utils/logger";
import GarbageSchedules from "./Garbage";

logging("Iniciando schedules.");

GarbageSchedules.clearTempFiles.start();
