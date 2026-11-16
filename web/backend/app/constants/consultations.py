from typing import Final

from app.constants.serum_tests import SerumProfile

# Routes
CONSULTATIONS_ROUTER_PREFIX: Final = "/consultations"
CONSULTATIONS_ROUTER_TAG: Final = "consultations"
CONSULT_QUEUE_PATH: Final = "/queue"

# File « À consulter » : les cas dont le suivi sérique est très fluctuant, à examiner (pas à signer).
CONSULT_QUEUE_PROFILE: Final = SerumProfile.FLUCTUATING
