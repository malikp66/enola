"use client";

import { useEffect } from "react";

import { TourProvider as BaseTourProvider, useTour } from "@/components/tour";
import { buildTourSteps } from "@/lib/tour-steps";
import type { SurveyAnalytics } from "@/types/survey";

export function DashboardTourProvider({
  analytics,
  children,
}: {
  analytics: SurveyAnalytics;
  children: React.ReactNode;
}) {
  return (
    <BaseTourProvider
      closeable
      onComplete={() => {
        localStorage.setItem("enola-tour-seen", "true");
      }}
      onSkip={() => {
        localStorage.setItem("enola-tour-seen", "true");
      }}
    >
      <TourSync analytics={analytics} />
      {children}
    </BaseTourProvider>
  );
}

function TourSync({ analytics }: { analytics: SurveyAnalytics }) {
  const { setSteps, startTour } = useTour();

  useEffect(() => {
    setSteps(buildTourSteps(analytics));

    // Auto start on first visit
    const hasSeenTour = localStorage.getItem("enola-tour-seen");
    if (!hasSeenTour) {
      // Small delay to ensure layout is stable
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [analytics, setSteps, startTour]);

  return null;
}

export function useDashboardTour() {
  const { startTour, setIsTourCompleted } = useTour();

  return () => {
    setIsTourCompleted(false);
    startTour();
  };
}
