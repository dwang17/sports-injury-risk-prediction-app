import type {
  InjuryRiskRequest,
  InjuryRiskResponse,
} from "../types/prediction";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getErrorMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data
  ) {
    const detail = data.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((error) => {
          if (
            typeof error === "object" &&
            error !== null &&
            "msg" in error
          ) {
            return String(error.msg);
          }

          return "One or more fields are invalid.";
        })
        .join(" ");
    }
  }

  return "The prediction request was unsuccessful.";
}

export async function predictInjuryRisk(
  request: InjuryRiskRequest,
): Promise<InjuryRiskResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error(
      "Unable to reach the prediction service. Make sure the backend is running.",
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as InjuryRiskResponse;
}