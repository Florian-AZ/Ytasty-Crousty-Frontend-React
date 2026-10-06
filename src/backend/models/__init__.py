# Centralise l'import de tous les modèles pour que Base les enregistre (nécessaire à la création des tables).
from backend.models.restaurant import Restaurant
from backend.models.user import User
from backend.models.produit import Produit
from backend.models.order import Status, PickupMode, Order
from backend.models.order_item import OrderItem

# Pour tester si les modèles se chargent bien dans le mapping SQLAlchemy :
# uv run python -c "import src.models; print('OK, modèles chargés')"