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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <p className="text-sm text-slate-500">Loading your assessment...</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Sports Performance Analytics
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Injury Risk Predictor
            </h1>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            No assessment results yet
          </h2>
          <p className="mt-4 text-slate-600">
            Complete the athlete assessment to see an estimated injury risk.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Start assessment
          </Link>
        </section>
      </main>
    );
  }

  const probability = result.injury_probability * 100;
  const isElevatedRisk = result.elevated_risk;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Sports Performance Analytics
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Injury Risk Predictor
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Assessment complete
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your estimated injury risk
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            This estimate is based on the information submitted for this
            assessment.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div
            className={`rounded-xl border p-6 ${
              isElevatedRisk
                ? "border-red-200 bg-red-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-wider ${
                isElevatedRisk ? "text-red-700" : "text-emerald-700"
              }`}
            >
              Estimated injury probability
            </p>
            <p className="mt-2 text-6xl font-bold tracking-tight text-slate-900">
              {probability.toFixed(1)}%
            </p>
            <p
              className={`mt-4 text-lg font-semibold ${
                isElevatedRisk ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {isElevatedRisk ? "Elevated Injury Risk" : "Lower Injury Risk"}
            </p>
          </div>

          <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Decision threshold</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {(result.threshold * 100).toFixed(0)}%
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Assessment status</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {isElevatedRisk ? "Review recommended" : "Within lower-risk range"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <Link
              href="/"
              className="inline-flex justify-center rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              New assessment
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to form
            </Link>
          </div>
        </div>

        <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-950">Educational use only</h3>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            This prediction is generated by an educational machine-learning
            model and should not be used as medical advice or diagnosis.
          </p>
        </aside>
      </section>
    </main>
  );
}
