"use client";
import { Spinner } from "@/components/ui/spinner";
import { fetchStats } from "@/services/adminService";
import { useEffect, useTransition, useState } from "react";
import { toast } from "sonner";
import { DashboardStats } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscountTable } from "@/components/DiscountTable";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const stats = await fetchStats<DashboardStats>();
        setStats(stats);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to fetch stats");
        }
      }
    });
  }, []);

  return (
    <div className="flex p-4 w-full">
      {isPending ? (
        <Spinner />
      ) : stats ? (
        <div className="flex w-full gap-4 cols-span-1 lg:cols-span-2 flex-wrap">
          <Card className="flex-1 ">
            <CardHeader>
              <CardTitle>Sale</CardTitle>
              <CardContent className="flex gap-2">
                <div className="flex flex-col shadow-md p-4 rounded-md bg-blue-200 text-blue-500">
                  <p>Total items Sold</p>
                  <p>{stats.itemsPurchased}</p>
                </div>
                <div className="flex flex-col shadow-md p-4 rounded-md bg-amber-200 text-amber-500">
                  <p>Sold items amount</p>
                  <p>${stats.purchaseAmount}</p>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="flex-1 ">
            <CardContent>
              <DiscountTable discounts={stats.discounts} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <p>No stats available</p>
      )}
    </div>
  );
}
