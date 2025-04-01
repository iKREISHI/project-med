from gigachat import GigaChat
from ..config import GIGACHAT_API_KEY

GigaConf = GigaChat(
   credentials=GIGACHAT_API_KEY,
   scope="GIGACHAT_API_PERS",
   model="GigaChat",
   verify_ssl_certs=False
)