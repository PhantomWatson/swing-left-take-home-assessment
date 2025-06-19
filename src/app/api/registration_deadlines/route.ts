import { fetchAll as fetchAllDeadlines } from "../../../models/VoterRegistrationDeadline";

export async function GET() {
  const deadlines = await fetchAllDeadlines();

  return Response.json(deadlines)
}
