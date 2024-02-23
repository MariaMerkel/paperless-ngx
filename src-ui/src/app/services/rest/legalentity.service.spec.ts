import { LegalEntityService } from './legalentity.service'
import { commonAbstractNameFilterPaperlessServiceTests } from './abstract-name-filter-service.spec'

commonAbstractNameFilterPaperlessServiceTests(
  'legal_entities',
  LegalEntityService
)
