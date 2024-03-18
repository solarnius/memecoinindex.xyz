import { NextResponse } from "next/server";
import portfolio from "../portfolio.json";

export async function GET(request: Request) {
	return NextResponse.json(portfolio);
}