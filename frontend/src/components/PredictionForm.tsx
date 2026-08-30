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
    const inputClassName = `mt-2 block w-full rounded-2xl border px-3.5 py-3 text-base text-white placeholder:text-slate-500 transition outline-none ring-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_8px_18px_rgba(2,6,23,0.28)] ${
      fieldError
        ? "border-red-400/80 bg-red-500/5 focus:border-red-400"
        : "border-white/10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.09),_rgba(15,23,32,0.9)_52%)] hover:border-white/20 focus:border-teal-400/70"
    }`;

    return (
      <div
        key={field.name}
        className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,32,0.72),rgba(11,16,24,0.92))] p-3.5 shadow-[0_12px_30px_rgba(2,6,23,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        <label
          htmlFor={fieldId}
          className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-200"
        >
          <span>
            {field.label}
            {field.unit && (
              <span className="font-normal text-slate-400">
                {" "}({field.unit})
              </span>
            )}
          </span>
          {field.isCore && (
            <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200">
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
            <option value="" className="bg-[#0d1520] text-slate-300">
              Not provided
            </option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#0d1520] text-white"
              >
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
          <p id={errorId} className="mt-1.5 text-xs font-medium text-red-300">
            {fieldError}
          </p>
        )}
        {field.min !== undefined && field.max !== undefined && (
          <p className="mt-1.5 text-[11px] text-slate-400">
            Range: {formatRangeValue(field.min)}-{formatRangeValue(field.max)}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="space-y-6">
        {formSections.map((section) => {
          const sectionContent = (
            <fieldset>
              <legend
                className={
                  section.collapsible
                    ? "sr-only"
                    : "text-lg font-semibold text-white"
                }
              >
                {section.title}
              </legend>
              <p className="mt-1 text-sm text-slate-400">{section.description}</p>
              {section.title === "Core Inputs" && (
                <div
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    coreInputCount >= 3
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-white/10 bg-white/[0.02] text-slate-300"
                  }`}
                >
                  {coreInputCount} of 5 core inputs provided
                </div>
              )}
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.fields.map(renderField)}
              </div>
            </fieldset>
          );

          if (section.collapsible) {
            return (
              <details
                key={section.title}
                className="group rounded-[22px] border border-white/10 bg-white/[0.02] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-white marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {section.title}
                    <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-xs font-medium text-sky-200">
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
                  ? "rounded-[22px] border border-sky-400/20 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_rgba(15,23,32,0.75)_55%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "rounded-[22px] border border-white/10 bg-white/[0.02] p-4"
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
          className="mt-8 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-[24px] border border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(15,23,32,0.9))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-200">
            Estimated Injury Risk
          </p>

          <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
            {(result.injury_probability * 100).toFixed(1)}%
          </p>

          <p
            className={`mt-3 text-base font-semibold ${
              result.elevated_risk ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {result.elevated_risk
              ? "Elevated Injury Risk"
              : "Lower Injury Risk"}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Decision threshold: {(result.threshold * 100).toFixed(0)}%
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={isSubmitting}
          className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear form
        </button>

        <button
          type="submit"
          disabled={isSubmitting || coreInputCount < 3 || hasInvalidFields}
          className="rounded-xl bg-[linear-gradient(135deg,#67e8f9,#0ea5e9)] px-6 py-2.5 font-semibold text-slate-950 shadow-[0_14px_30px_rgba(14,165,233,0.35)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Estimating..." : "Estimate Injury Risk"}
        </button>
      </div>
    </form>
  );
}
