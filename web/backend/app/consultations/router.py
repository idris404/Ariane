from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.auth.dependencies import current_active_user
from app.constants.consultations import (
    CONSULT_QUEUE_PATH,
    CONSULTATIONS_ROUTER_PREFIX,
    CONSULTATIONS_ROUTER_TAG,
)
from app.consultations.dependencies import get_consultation_service
from app.consultations.schemas import ConsultQueueQuery
from app.consultations.services import ConsultationService
from app.core.pagination import Page
from app.patients.schemas import PatientRead

# Données de santé : toutes les routes du contexte exigent une session valide.
router = APIRouter(
    prefix=CONSULTATIONS_ROUTER_PREFIX,
    tags=[CONSULTATIONS_ROUTER_TAG],
    dependencies=[Depends(current_active_user)],
    responses={status.HTTP_401_UNAUTHORIZED: {"description": "Missing token or inactive user."}},
)


@router.get(CONSULT_QUEUE_PATH, response_model=Page[PatientRead])
async def consult_queue(
    query: Annotated[ConsultQueueQuery, Query()],
    service: ConsultationService = Depends(get_consultation_service),
) -> Page[PatientRead]:
    """Cas synthétiques au suivi sérique fluctuant, paginés, à consulter (pas à signer)."""
    return await service.queue(query)
