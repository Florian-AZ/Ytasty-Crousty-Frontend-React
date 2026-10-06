import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import axios from "axios";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
    },
});

const API = "http://127.0.0.1:8000";
const commandesAnnoncees = new Set();

io.on("connection", (socket) => {
    console.log("Client connecté");

    // Associe la connexion au compte et au restaurant affiché.
    socket.on("user_login", (user) => {
        if (
            typeof user?.token !== "string" ||
            !Number.isInteger(user?.restaurant_id)
        ) {
            return;
        }

        socket.data = {
            token: user.token,
            restaurant_id: user.restaurant_id,
        };
    });

    // Le formulaire envoie le numéro après la création de la commande.
    socket.on("new_order", async (numero) => {
        if (typeof numero !== "string") return;

        try {
            // Récupère la vraie commande depuis ton API.
            const { data: commande } = await axios.get(
                `${API}/orders/${encodeURIComponent(numero)}`,
                { timeout: 5000 },
            );

            // Évite plusieurs annonces pour le même numéro.
            if (commandesAnnoncees.has(numero)) return;
            commandesAnnoncees.add(numero);

            for (const client of io.sockets.sockets.values()) {
                const compte = client.data;

                if (compte.restaurant_id !== commande.restaurant_id) {
                    continue;
                }

                try {
                    // Ton backend vérifie le token et les droits du compte.
                    await axios.get(
                        `${API}/restaurants/${compte.restaurant_id}/orders`,
                        {
                            headers: {
                                Authorization: `Bearer ${compte.token}`,
                            },
                            timeout: 5000,
                        },
                    );

                    // Vérifie que le compte n'a pas changé pendant la requête.
                    if (client.connected && client.data === compte) {
                        client.emit("new_order", commande);
                    }
                } catch {
                    if (client.connected && client.data === compte) {
                        client.emit(
                            "socket_error",
                            "Impossible de recevoir les alertes : vérifiez votre connexion et vos droits.",
                        );
                    }
                }
            }
        } catch {
            console.log("Impossible de récupérer la commande.");
        }
    });

    socket.on("logout", () => {
        socket.data = {};
    });
});

server.listen(4001, () => {
    console.log("Socket.IO lancé sur http://localhost:4001");
});