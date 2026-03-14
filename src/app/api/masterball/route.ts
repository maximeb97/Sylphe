import { NextResponse } from "next/server";

export async function GET() {
    const masterballData = {
        id: 1,
        name: "Master Ball",
        cost: 0,
        fling_power: null,
        fling_effect: null,
        attributes: ["holdable", "holdable-active"],
        category: {
            name: "standard-balls",
            url: "https://pokeapi.co/api/v2/item-category/34/"
        },
        effect_entries: [
            {
                effect: "Attrapes n'importe quel Pokémon sauvage sans jamais échouer.",
                short_effect: "Taux de capture 100%.",
                language: { name: "fr" }
            }
        ],
        sprites: {
            default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
        },
        message_secret: "Vous avez trouvé le point de distribution d'usine de la Sylphe SARL !"
    };

    return NextResponse.json(
        masterballData,
        {
            status: 200,
            headers: {
                "X-Sylphe-Inventory": "1",
                "X-Secret-Hint": "Rends-toi sur l'OS et tape la commande masterball pour la déverrouiller définitivement dans le monde réel."
            }
        }
    );
}
