import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your journey — EthAum",
  description: "Track every stage of your care journey — from case creation to booking, treatment and aftercare.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
