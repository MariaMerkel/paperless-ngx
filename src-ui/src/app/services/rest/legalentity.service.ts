import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { LegalEntity } from 'src/app/data/legalentity'
import { AbstractNameFilterService } from './abstract-name-filter-service'

@Injectable({
  providedIn: 'root',
})
export class LegalEntityService extends AbstractNameFilterService<LegalEntity> {
  constructor(http: HttpClient) {
    super(http, 'legal_entities')
  }
}
