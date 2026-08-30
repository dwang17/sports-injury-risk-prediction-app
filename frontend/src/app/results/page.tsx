"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { InjuryRiskResponse } from "../../types/prediction";

const RESULT_STORAGE_KEY = "injury-risk-result";

export default function ResultsPage() {
  const [result, setResult] = useState<InjuryRiskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedResult = sessionStorage.getItem(RESULT_STORAGE_KEY);

      if (storedResult) {
        try {
          setResult(JSON.parse(storedResult) as InjuryRiskResponse);
        } catch {
          sessionStorage.removeItem(RESULT_STORAGE_KEY);
        }
      }

      setIsLoading(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050a12] px-6 text-white">
        <p className="text-sm text-slate-300">Loading your assessment...</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-[#050a12] text-white">
        <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">
              Sports Performance Analytics
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Injury Risk Predictor
            </h1>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-8 shadow-[0_24px_80px_rgba(2,8,23,0.6)]">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              No assessment results yet
            </h2>
            <p className="mt-4 text-slate-300">
              Complete the athlete assessment to see an estimated injury risk.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex rounded-xl bg-[linear-gradient(135deg,#67e8f9,#0ea5e9)] px-6 py-2.5 font-semibold text-slate-950 shadow-[0_14px_30px_rgba(14,165,233,0.35)] transition hover:brightness-110"
            >
              Start assessment
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const probabilityPercent = result.injury_probability * 100;
  const thresholdPercent = result.threshold * 100;
  const differencePercent = Math.abs(probabilityPercent - thresholdPercent);
  const isElevatedRisk = result.elevated_risk;
  const isAtThreshold = Math.abs(differencePercent) < 0.05; // Round 0.0

  // Determine dynamic status labels
  let mainStatus: string;
  let supportingStatus: string;
  let comparisonText: string;
  let explanationText: string;
  let summaryText: string;

  if (isAtThreshold) {
    mainStatus = "At review threshold";
    supportingStatus = "Assessment complete";
    comparisonText = "At the model's review threshold";
    explanationText =
      "Your estimate is at the model's review threshold.";
    summaryText = `Your estimated injury probability is ${probabilityPercent.toFixed(1)}%. This estimate aligns with the model's ${thresholdPercent.toFixed(0)}% review threshold.`;
  } else if (isElevatedRisk) {
    mainStatus = "Above review threshold";
    supportingStatus = "Review recommended";
    comparisonText = `${differencePercent.toFixed(1)} percentage points above`;
    explanationText =
      "Your submitted measurements produced an estimate above the model's review threshold. Consider reviewing your recovery and training conditions.";
    summaryText = `Your estimated injury probability is ${probabilityPercent.toFixed(1)}%. This is ${differencePercent.toFixed(1)} percentage points above the model's ${thresholdPercent.toFixed(0)}% review threshold, so the result has been flagged for additional attention.`;
  } else {
    mainStatus = "Below review threshold";
    supportingStatus = "No additional review flag";
    comparisonText = `${differencePercent.toFixed(1)} percentage points below`;
    explanationText =
      "Your submitted measurements produced an estimate below the model's review threshold. This result was not flagged for additional attention.";
    summaryText = `Your estimated injury probability is ${probabilityPercent.toFixed(1)}%. This is ${differencePercent.toFixed(1)} percentage points below the model's ${thresholdPercent.toFixed(0)}% review threshold, so the result was not flagged for additional attention.`;
  }

  return (
    <main className="min-h-screen bg-[#050a12] text-white">
      <header className="border-b border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">
            Sports Performance Analytics
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Injury Risk Predictor
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">
            Assessment complete
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your estimated injury risk
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            This estimate is based on the information submitted for this
            assessment.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,32,0.96),rgba(10,15,24,0.92))] p-5 shadow-[0_24px_80px_rgba(2,8,23,0.6)] sm:p-8">
          <div
            className={`rounded-[24px] border p-6 ${
              isAtThreshold
                ? "border-amber-400/30 bg-amber-500/10"
                : isElevatedRisk
                  ? "border-red-400/30 bg-red-500/10"
                  : "border-emerald-400/30 bg-emerald-500/10"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                    isAtThreshold
                      ? "text-amber-200"
                      : isElevatedRisk
                        ? "text-red-200"
                        : "text-emerald-200"
                  }`}
                >
                  Estimated injury probability
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  {probabilityPercent.toFixed(1)}%
                </p>
              </div>
              <div
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isAtThreshold
                    ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
                    : isElevatedRisk
                      ? "border-red-400/40 bg-red-500/10 text-red-100"
                      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                }`}
              >
                {supportingStatus}
              </div>
            </div>

            <p
              className={`mt-4 text-lg font-semibold ${
                isAtThreshold
                  ? "text-amber-200"
                  : isElevatedRisk
                    ? "text-red-200"
                    : "text-emerald-200"
              }`}
            >
              {mainStatus}
            </p>

            <p className="mt-4 text-base leading-7 text-slate-300">
              {explanationText}
            </p>
          </div>

          <dl className="mt-6 grid gap-4 border-t border-white/10 pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <dt className="text-sm text-slate-400">Summary</dt>
              <dd className="mt-2 text-base leading-7 text-slate-200">
                {summaryText}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <dt className="text-sm text-slate-400">Compared with threshold</dt>
              <dd className="mt-2 text-lg font-semibold text-white">
                {comparisonText}{!isAtThreshold && ` the ${thresholdPercent.toFixed(0)}% threshold`}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <Link
              href="/"
              className="inline-flex justify-center rounded-xl bg-[linear-gradient(135deg,#67e8f9,#0ea5e9)] px-6 py-2.5 font-semibold text-slate-950 shadow-[0_14px_30px_rgba(14,165,233,0.35)] transition hover:brightness-110"
            >
              New assessment
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center rounded-xl border border-white/10 bg-white/[0.02] px-6 py-2.5 font-medium text-slate-200 transition hover:bg-white/[0.04]"
            >
              Back to form
            </Link>
          </div>
        </div>

        <aside className="mt-8 rounded-[22px] border border-slate-400/20 bg-slate-400/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
          <p className="text-sm leading-6 text-slate-300">
            The review threshold is the cutoff this model uses to categorize
            results. It is not a medical safety limit or a diagnosis.
          </p>
        </aside>

        <aside className="mt-8 rounded-[22px] border border-amber-400/20 bg-amber-500/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
          <h3 className="font-semibold text-amber-200">Educational use only</h3>
          <p className="mt-1 text-sm leading-6 text-amber-100/80">
            This prediction is generated by an educational machine-learning
            model and should not be used as medical advice or diagnosis.
          </p>
        </aside>
      </section>
    </main>
  );
}
