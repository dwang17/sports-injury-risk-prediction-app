"use client";
import { predictInjuryRisk } from "../lib/api";
import type { InjuryRiskResponse } from "../types/prediction";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formSections, type FormField } from "../data/formFields";
import {
  initialInjuryRiskRequest,
  type InjuryRiskRequest,
} from "../types/prediction";

export default function PredictionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<InjuryRiskRequest>({
    ...initialInjuryRiskRequest,
  });

  const [result, setResult] = useState<InjuryRiskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field: FormField, rawValue: string) {
    let parsedValue: string | number | null;

    if (rawValue === "") {
      parsedValue = null;
    } else if (field.name === "sport_type") {
      parsedValue = rawValue;
    } else {
      parsedValue = Number(rawValue);
    }

    setFormData((currentData) => ({
      ...currentData,
      [field.name]: parsedValue,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictInjuryRisk(formData);
      setResult(prediction);
      sessionStorage.setItem("injury-risk-result", JSON.stringify(prediction));
      router.push("/results");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClear() {
    setFormData({ ...initialInjuryRiskRequest });
    setResult(null);
    setError(null);
  }

  function formatRangeValue(value: number) {
    return Number.isInteger(value)
      ? value.toLocaleString()
      : Number(value.toFixed(2)).toLocaleString();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="space-y-10">
        {formSections.map((section) => (
          <fieldset key={section.title}>
            <legend className="text-lg font-semibold text-slate-900">
              {section.title}
            </legend>

            <p className="mt-1 text-sm text-slate-500">{section.description}</p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.fields.map((field) => {
                const fieldId = `field-${field.name}`;
                const value = formData[field.name] ?? "";

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={fieldId}
                      className="block text-sm font-medium text-slate-700"
                    >
                      {field.label}

                      {field.unit && (
                        <span className="font-normal text-slate-500">
                          {" "}
                          ({field.unit})
                        </span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={fieldId}
                        name={field.name}
                        value={value}
                        onChange={(event) =>
                          handleFieldChange(field, event.target.value)
                        }
                        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Not provided</option>

                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={fieldId}
                        name={field.name}
                        type="number"
                        value={value}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder="Not provided"
                        onChange={(event) =>
                          handleFieldChange(field, event.target.value)
                        }
                        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    )}

                    {field.min !== undefined && field.max !== undefined && (
                      <p className="mt-1.5 text-xs text-slate-500">
                        Range: {formatRangeValue(field.min)}–
                        {formatRangeValue(field.max)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm font-medium text-blue-700">
            Estimated Injury Risk
          </p>

          <p className="mt-1 text-4xl font-bold text-slate-900">
            {(result.injury_probability * 100).toFixed(1)}%
          </p>

          <p
            className={`mt-3 font-semibold ${
              result.elevated_risk ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {result.elevated_risk
              ? "Elevated Injury Risk"
              : "Lower Injury Risk"}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Decision threshold: {(result.threshold * 100).toFixed(0)}%
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear form
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? "Estimating..." : "Estimate Injury Risk"}
        </button>
      </div>
    </form>
  );
}
