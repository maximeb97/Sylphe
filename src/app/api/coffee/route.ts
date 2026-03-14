import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(
        { message: "HTTP 418: I'm a teapot. Impossible de préparer du café avec cette machine de technologie archaïque." },
        {
            status: 418,
            headers: {
                "X-Sylphe-Secret": "Félicitations pour le reverse-engineering du terminal !",
                "X-Developer-Msg": "Le bouton de café est bloqué depuis l'arrivée de la Team Rocket.",
                "X-Mew-Hint": "Cherche sous l'eau..."
            }
        }
    );
}
