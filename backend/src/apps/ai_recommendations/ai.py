from config.settings.ai.gigachat import GigaConf


class AI:
    context = ''

    def __init__(self, provider):
        self.provider = provider

    def send_message(self, message: str) -> str:
        result = self.provider.chat(f"{self.context} {message}")

        return result.choices[0].message.content