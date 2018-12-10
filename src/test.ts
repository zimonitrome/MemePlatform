import { authenticateHeader } from "./helpers/authenticationHelpers";

const a = authenticateHeader("Bearer hojtaballojta");
console.log(a);
