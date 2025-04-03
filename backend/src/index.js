"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const course_route_1 = __importDefault(require("../routes/course.route"));
const assessments_route_1 = __importDefault(require("../routes/assessments.route"));
const certificates_route_1 = __importDefault(require("../routes/certificates.route"));
const student_routes_1 = __importDefault(require("../routes/student.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Default Route
app.get("/", (req, res) => {
    res.send("Hello, TypeScript Server!");
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/courses", course_route_1.default);
app.use("/api/assessments", assessments_route_1.default);
app.use("/api/certificates", certificates_route_1.default);
app.use("/api/student", student_routes_1.default);
// Start Server
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    yield (0, db_1.default)();
}));
