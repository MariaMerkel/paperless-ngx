import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { PaperlessLegalEntity } from 'src/app/data/paperless-legalentity'
import { AbstractNameFilterService } from './abstract-name-filter-service'

@Injectable({
  providedIn: 'root',
})
export class LegalEntityService extends AbstractNameFilterService<PaperlessLegalEntity> {
  constructor(http: HttpClient) {
    super(http, 'legal_entities')
  }
}
