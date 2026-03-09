import React from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { Flag } from "@/components/ui/Flag";

const TestFlagsPage = () => {
  const countryCodes = Object.keys(Flags).filter((key) => key.length === 2);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Country Flags ({countryCodes.length})</h1>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {countryCodes.map((code) => (
          <div key={code} className="flex flex-col items-center gap-2 p-4 border rounded hover:bg-gray-50">
            <Flag countryCode={code} className="w-12 h-8 shadow-sm" />
            <span className="text-sm font-mono text-gray-600">{code}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestFlagsPage;
