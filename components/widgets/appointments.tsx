import React from "react";

import { Card, CardContent } from "../ui/card";
import { AppointmentsAreaChart } from "./area-chart";
import { chartData } from "@/lib/sampleData";

export default function Appointments() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex h-full flex-col">
        <CardContent className="flex-1 p-6">
          <div className="text-xl md:text-2xl lg:text-3xl">Appointments</div>
          <div className="flex h-full flex-col">
            <div className="flex-1 items-center justify-center">
              <AppointmentsAreaChart data={chartData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
