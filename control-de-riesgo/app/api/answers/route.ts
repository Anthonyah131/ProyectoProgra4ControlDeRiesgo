import { answer } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const answers = await prisma.answer.findMany();
    return NextResponse.json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {} = body as answer;

    const newAnswer = await prisma.answer.create({
      data: {
        ...(body as answer),
      },
    });

    return NextResponse.json(newAnswer);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { QUESTION_quest_id, DEPARTMENT_dep_id } = body as answer;

    const existingAnswer = await prisma.answer.findFirst({
      where: { QUESTION_quest_id, DEPARTMENT_dep_id },
    });

    if (existingAnswer) {
      const updatedAnswer = await prisma.answer.update({
        where: { answ_id: existingAnswer.answ_id },
        data: body,
      });
      return NextResponse.json(updatedAnswer);
    } else {
      const newAnswer = await prisma.answer.create({
        data: body,
      });
      return NextResponse.json(newAnswer);
    }
  } catch (error) {
    console.error("Error upserting answer:", error);
    return NextResponse.error();
  }
}

