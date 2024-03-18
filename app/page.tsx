import Image from "next/image";
import ROI from "./ROI";

export default function Home() {
  return (
    <div className="flex flex-col items-center py-2">
      <h1>memecoin index</h1>
      <ROI />
    </div>
  );
}
