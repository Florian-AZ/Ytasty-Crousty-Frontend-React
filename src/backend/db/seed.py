from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from backend.core import hashing_mdp
from backend.models import User, Restaurant, Produit, Order, OrderItem, Status


def seed_admin(db: Session):
    adm = db.query(User).filter_by(username="admin123").first()
    if not adm:
        db.add(User(
            first_name="Admin",
            last_name="Ytasty",
            username="admin123",
            hashed_password=hashing_mdp("Admin@123456"),
            role="admin"
        ))
        db.commit()


UTILISATEURS_DEMO = [
    {"first_name": "Sam", "last_name": "Staff", "username": "staffaix1", "password": "Staff@123456", "role": "staff",
     "restaurant_id": 1},
    {"first_name": "Lea", "last_name": "Staff", "username": "stafflyon1", "password": "Staff@123456", "role": "staff",
     "restaurant_id": 2},
    {"first_name": "Dan", "last_name": "Direction", "username": "direction1", "password": "Direction@123456",
     "role": "direction", "restaurant_id": None},
]


def seed_utilisateurs(db: Session):
    for fiche in UTILISATEURS_DEMO:
        existant = db.query(User).filter_by(username=fiche["username"]).first()
        if not existant:
            db.add(User(
                first_name=fiche["first_name"],
                last_name=fiche["last_name"],
                username=fiche["username"],
                # Écriture champ par champ (pas de **) car password devient hashed_password
                hashed_password=hashing_mdp(fiche["password"]),
                role=fiche["role"],
                restaurant_id=fiche["restaurant_id"],
            ))
    db.commit()


RESTAURANT = [
    {
        "name": "Ytasty Crousty Aix",
        "city": "Aix-en-Provence",
        "address": "12 cours Mirabeau",
        "opening_hours": "11h-23h",
        "contact": "04 42 00 00 01"
    },
    {
        "name": "Ytasty Crousty Lyon",
        "city": "Lyon",
        "address": "5 rue de la République",
        "opening_hours": "11h-23h",
        "contact": "04 72 00 00 02"
    },
    {
        "name": "Ytasty Crousty Paris",
        "city": "Paris",
        "address": "20 boulevard Saint-Michel",
        "opening_hours": "11h-00h",
        "contact": "01 40 00 00 03"
    }
]


def seed_restaurant(db: Session):
    for restaurant in RESTAURANT:
        rst = db.query(Restaurant).filter_by(name=restaurant["name"]).first()
        if not rst:
            db.add(Restaurant(**restaurant))
    db.commit()


# restaurant_id : 1 = Aix, 2 = Lyon, 3 = Paris (ordre d'insertion du seed sur une base neuve)
PRODUITS = [
    {"name": "Crispy Chicken Burger", "image": "/images/CrispyChickenBurger.png",
     "description": "Burger au poulet pané croustillant", "category": "burgers", "price": 9.9, "is_available": True,
     "restaurant_id": 1, "ingredients": ["pain", "poulet", "salade", "sauce maison"]},
    {"name": "Double Cheese", "image": "/images/DoubleCheeseBurger.png",
     "description": "Deux steaks, double cheddar", "category": "burgers", "price": 11.5, "is_available": True,
     "restaurant_id": 1, "ingredients": ["pain", "boeuf", "cheddar", "oignons"]},
    {"name": "Tenders x6", "image": "/images/6xTenders.png", "description": "Six tenders de poulet marinés",
     "category": "chicken", "price": 7.5, "is_available": True, "restaurant_id": 1,
     "ingredients": ["poulet", "chapelure", "épices"]},
    {"name": "Frites maison", "image": "/images/Frites.png",
     "description": "Frites fraîches coupées sur place", "category": "sides", "price": 3.5, "is_available": False,
     "restaurant_id": 1, "ingredients": ["pommes de terre", "sel"]},
    {"name": "Spicy Chicken Wrap", "image": "/images/SpicyChickenWrap.png",
     "description": "Wrap relevé au poulet grillé", "category": "wraps", "price": 8.9, "is_available": True,
     "restaurant_id": 2, "ingredients": ["galette", "poulet", "piment", "cheddar"]},
    {"name": "Veggie Burger", "image": "/images/VeganBurger.png", "description": "Galette de légumes et avocat",
     "category": "burgers", "price": 10.5, "is_available": True, "restaurant_id": 2,
     "ingredients": ["pain", "galette de légumes", "avocat", "salade"]},
    {"name": "Milkshake Vanille", "image": "/images/Milkshake.png",
     "description": "Milkshake onctueux à la vanille", "category": "drinks", "price": 4.5, "is_available": True,
     "restaurant_id": 3, "ingredients": ["lait", "glace vanille"]},
    {"name": "Crousty Box", "image": "/images/CroustyBox.png",
     "description": "Menu burger, frites et boisson", "category": "menus", "price": 14.9, "is_available": True,
     "restaurant_id": 3, "ingredients": ["burger", "frites", "boisson"]},
    {"name": "Burger Test", "image": "/images/BurgerTest.png", "description": "Produit créé pour les tests",
     "category": "burgers", "price": 9.9, "is_available": True, "restaurant_id": 1, "ingredients": ["pain", "poulet"]},
]


def seed_produits(db: Session):
    for fiche in PRODUITS:
        # Un même nom de produit peut exister dans deux restaurants : on vérifie le couple nom + restaurant
        existant = db.query(Produit).filter_by(
            name=fiche["name"], restaurant_id=fiche["restaurant_id"]
        ).first()
        if not existant:
            db.add(Produit(**fiche))
    db.commit()


# + Order, OrderItem et Status, avec le même import que tes autres modèles (Restaurant, Produit...)

# ---------- Commandes de démo ----------
# Pour chaque restaurant : des commandes à traiter (dont une en retard), en préparation et prêtes pour la cuisine,
# plus des commandes terminées (collected / cancelled) pour tester la page de suivi.
# order_number fixe : sert à vérifier si la commande existe déjà (seed idempotent) et à la retrouver pendant la démo.
# il_y_a : âge de la commande en minutes au premier démarrage (pending depuis 10 min ou plus = alerte rouge en cuisine).
# articles : (position du produit dans la carte du restaurant, quantité) -> pas besoin de connaître les id en base.
COMMANDES = [
    # ----- Aix (restaurant 1) -----
    {"order_number": "YC-AIX00001", "restaurant_id": 1, "status": "pending", "pickup_mode": "takeaway", "il_y_a": 2,
     "client": "Léa Martin", "email": "lea.martin@example.com", "articles": [(0, 2), (3, 1)]},
    {"order_number": "YC-AIX00002", "restaurant_id": 1, "status": "pending", "pickup_mode": "onsite", "il_y_a": 14,
     "client": "Hugo Bernard", "email": "hugo.bernard@example.com", "articles": [(1, 1)]},
    {"order_number": "YC-AIX00003", "restaurant_id": 1, "status": "validated", "pickup_mode": "takeaway", "il_y_a": 6,
     "client": "Chloé Petit", "email": "chloe.petit@example.com", "articles": [(2, 1), (4, 2)]},
    {"order_number": "YC-AIX00004", "restaurant_id": 1, "status": "preparing", "pickup_mode": "onsite", "il_y_a": 9,
     "client": "Nathan Roux", "email": "nathan.roux@example.com", "articles": [(0, 1), (1, 1), (5, 1)]},
    {"order_number": "YC-AIX00005", "restaurant_id": 1, "status": "ready", "pickup_mode": "takeaway", "il_y_a": 18,
     "client": "Inès Moreau", "email": "ines.moreau@example.com", "articles": [(3, 3)]},
    {"order_number": "YC-AIX00006", "restaurant_id": 1, "status": "collected", "pickup_mode": "onsite", "il_y_a": 75,
     "client": "Lucas Girard", "email": "lucas.girard@example.com", "articles": [(0, 1), (2, 1)]},
    # ----- Lyon (restaurant 2) -----
    {"order_number": "YC-LYO00001", "restaurant_id": 2, "status": "pending", "pickup_mode": "onsite", "il_y_a": 4,
     "client": "Manon Fournier", "email": "manon.fournier@example.com", "articles": [(0, 1), (1, 2)]},
    {"order_number": "YC-LYO00002", "restaurant_id": 2, "status": "pending", "pickup_mode": "takeaway", "il_y_a": 12,
     "client": "Louis Lambert", "email": "louis.lambert@example.com", "articles": [(2, 1)]},
    {"order_number": "YC-LYO00003", "restaurant_id": 2, "status": "preparing", "pickup_mode": "takeaway", "il_y_a": 7,
     "client": "Camille Faure", "email": "camille.faure@example.com", "articles": [(1, 1), (3, 1)]},
    {"order_number": "YC-LYO00004", "restaurant_id": 2, "status": "ready", "pickup_mode": "onsite", "il_y_a": 15,
     "client": "Jules Mercier", "email": "jules.mercier@example.com", "articles": [(0, 2)]},
    {"order_number": "YC-LYO00005", "restaurant_id": 2, "status": "cancelled", "pickup_mode": "takeaway", "il_y_a": 40,
     "client": "Sarah Blanc", "email": "sarah.blanc@example.com", "articles": [(2, 1), (3, 1)]},
    # ----- Paris (restaurant 3) -----
    {"order_number": "YC-PAR00001", "restaurant_id": 3, "status": "pending", "pickup_mode": "takeaway", "il_y_a": 1,
     "client": "Adam Garnier", "email": "adam.garnier@example.com", "articles": [(0, 1), (2, 1)]},
    {"order_number": "YC-PAR00002", "restaurant_id": 3, "status": "validated", "pickup_mode": "onsite", "il_y_a": 11,
     "client": "Zoé Chevalier", "email": "zoe.chevalier@example.com", "articles": [(1, 2)]},
    {"order_number": "YC-PAR00003", "restaurant_id": 3, "status": "preparing", "pickup_mode": "onsite", "il_y_a": 5,
     "client": "Gabriel Robin", "email": "gabriel.robin@example.com", "articles": [(0, 1), (1, 1), (3, 2)]},
    {"order_number": "YC-PAR00004", "restaurant_id": 3, "status": "ready", "pickup_mode": "takeaway", "il_y_a": 20,
     "client": "Jade Muller", "email": "jade.muller@example.com", "articles": [(2, 1)]},
    {"order_number": "YC-PAR00005", "restaurant_id": 3, "status": "collected", "pickup_mode": "takeaway", "il_y_a": 120,
     "client": "Raphaël Henry", "email": "raphael.henry@example.com", "articles": [(3, 1), (0, 1)]},
]


def seed_commandes(db: Session):
    for c in COMMANDES:
        # Déjà en base : on ne la recrée pas (le seed tourne à chaque démarrage)
        if db.query(Order).filter(Order.order_number == c["order_number"]).first():
            continue

        # Carte du restaurant, triée par id pour que les positions donnent toujours les mêmes produits
        produits = db.query(Produit).filter(Produit.restaurant_id == c["restaurant_id"]).order_by(Produit.id).all()
        if not produits:
            continue  # restaurant sans produit : rien à commander

        # % len(produits) : reste dans la liste même si le restaurant a moins de produits que la position demandée.
        # Un produit tiré deux fois est regroupé sur une seule ligne (sinon doublon de key côté React en cuisine).
        quantites = {}
        for position, quantite in c["articles"]:
            produit = produits[position % len(produits)]
            quantites[produit] = quantites.get(produit, 0) + quantite

        # Prix figé copié depuis le produit en base, comme dans POST /orders ; total calculé côté serveur
        lignes = []
        total = Decimal("0")
        for produit, quantite in quantites.items():
            lignes.append(OrderItem(product_id=produit.id, quantity=quantite, prix_fige_commande=produit.price))
            total += produit.price * quantite

        db.add(Order(
            order_number=c["order_number"],
            restaurant_id=c["restaurant_id"],
            created_at=datetime.now(timezone.utc) - timedelta(minutes=c["il_y_a"]),
            status=Status(c["status"]),  # Status("pending") -> Status.pending
            pickup_mode=c["pickup_mode"],
            customer_name=c["client"],
            customer_email=c["email"],
            total_price=total,
            order_items=lignes,  # relationship : les lignes sont enregistrées avec la commande
        ))
    db.commit()
