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
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof InjuryRiskRequest, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coreFields = formSections
    .flatMap((section) => section.fields)
    .filter((field) => field.isCore);
  const coreInputCount = coreFields.filter(
    (field) =>
      formData[field.name] !== null &&
      !getFieldError(field, formData[field.name] as number | null),
  ).length;
  const hasInvalidFields = Object.keys(fieldErrors).length > 0;

  function getFieldError(field: FormField, value: number | null) {
    if (value === null || Number.isNaN(value)) {
      return undefined;
    }

    if (field.min !== undefined && value < field.min) {
      return `Value must be at least ${formatRangeValue(field.min)}.`;
    }

    if (field.max !== undefined && value > field.max) {
      return `Value must be no greater than ${formatRangeValue(field.max)}.`;
    }

    if (field.decimalPlaces !== undefined) {
      const decimalPart = String(value).split(".")[1] ?? "";

      if (decimalPart.length > field.decimalPlaces) {
        return `Use no more than ${field.decimalPlaces} decimal place${
          field.decimalPlaces === 1 ? "" : "s"
        }.`;
      }
    }

    return undefined;
  }

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

    const fieldError =
      field.type === "number"
        ? getFieldError(field, parsedValue as number | null)
        : undefined;

    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      if (fieldError) {
        nextErrors[field.name] = fieldError;
      } else {
        delete nextErrors[field.name];
      }

      return nextErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasInvalidFields) {
      setError("Please correct the highlighted values before submitting.");
      return;
    }

    if (coreInputCount < 3) {
      setError("Please provide at least 3 of the 5 core inputs to continue.");
      document.getElementById("core-inputs")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

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
    setFieldErrors({});
  }

  function formatRangeValue(value: number) {
    return Number.isInteger(value)
      ? value.toLocaleString()
      : Number(value.toFixed(2)).toLocaleString();
  }

  function renderField(field: FormField) {
    const fieldId = `field-${field.name}`;
    const errorId = `${fieldId}-error`;
    const value = formData[field.name] ?? "";
    const fieldError = fieldErrors[field.name];
    const inputClassName = `mt-2 block w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 ${
      fieldError
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }`;

    return (
      <div key={field.name}>
        <label
          htmlFor={fieldId}
          className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700"
        >
          <span>
            {field.label}
            {field.unit && (
              <span className="font-normal text-slate-500">
                {" "}({field.unit})
              </span>
            )}
          </span>
          {field.isCore && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
              Core
            </span>
          )}
        </label>

        {field.type === "select" ? (
          <select
            id={fieldId}
            name={field.name}
            value={value}
            onChange={(event) => handleFieldChange(field, event.target.value)}
            className={inputClassName}
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
            onChange={(event) => handleFieldChange(field, event.target.value)}
            aria-invalid={fieldError ? "true" : "false"}
            aria-describedby={fieldError ? errorId : undefined}
            className={inputClassName}
          />
        )}

        {fieldError && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-red-700">
            {fieldError}
          </p>
        )}
        {field.min !== undefined && field.max !== undefined && (
          <p className="mt-1.5 text-xs text-slate-500">
            Range: {formatRangeValue(field.min)}-{formatRangeValue(field.max)}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="space-y-8">
        {formSections.map((section) => {
          const sectionContent = (
            <fieldset>
              <legend
                className={
                  section.collapsible
                    ? "sr-only"
                    : "text-lg font-semibold text-slate-900"
                }
              >
                {section.title}
              </legend>
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
              {section.title === "Core Inputs" && (
                <p
                  className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
                    coreInputCount >= 3
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {coreInputCount} of 5 core inputs provided
                </p>
              )}
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.fields.map(renderField)}
              </div>
            </fieldset>
          );

          if (section.collapsible) {
            return (
              <details key={section.title} className="group rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {section.title}
                    <span className="text-sm font-medium text-blue-700">
                      <span className="group-open:hidden">{section.summary}</span>
                      <span className="hidden group-open:inline">Collapse</span>
                    </span>
                  </span>
                </summary>
                <div className="pt-5">{sectionContent}</div>
              </details>
            );
          }

          return (
            <section
              key={section.title}
              id={section.title === "Core Inputs" ? "core-inputs" : undefined}
              tabIndex={section.title === "Core Inputs" ? -1 : undefined}
              className={
                section.title === "Core Inputs"
                  ? "rounded-xl border border-blue-200 bg-blue-50/40 p-5"
                  : undefined
              }
            >
              {sectionContent}
            </section>
          );
        })}
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
          disabled={isSubmitting || coreInputCount < 3 || hasInvalidFields}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? "Estimating..." : "Estimate Injury Risk"}
        </button>
      </div>
    </form>
  );
}
