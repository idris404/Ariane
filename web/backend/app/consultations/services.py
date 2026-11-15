from app.consultations.repository import ConsultationRepository
from app.consultations.schemas import ConsultQueueQuery
from app.core.pagination import Page
from app.patients.schemas import PatientRead


class ConsultationService:
    def __init__(self, repository: ConsultationRepository) -> None:
        self._repository = repository

    async def queue(self, query: ConsultQueueQuery) -> Page[PatientRead]:
        patients = await self._repository.fluctuating(
            offset=(query.page - 1) * query.page_size, limit=query.page_size
        )
        return Page[PatientRead](
            items=[PatientRead.model_validate(patient) for patient in patients],
            total=await self._repository.count_fluctuating(),
            page=query.page,
            page_size=query.page_size,
        )
