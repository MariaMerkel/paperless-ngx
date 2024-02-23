import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LegalEntityListComponent } from './legalentity-list.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DatePipe } from '@angular/common'
import { SortableDirective } from 'src/app/directives/sortable.directive'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PageHeaderComponent } from '../../common/page-header/page-header.component'
import { IfPermissionsDirective } from 'src/app/directives/if-permissions.directive'
import { LegalEntityService } from 'src/app/services/rest/legalentity.service'
import { of } from 'rxjs'

describe('LegalEntityListComponent', () => {
  let component: LegalEntityListComponent
  let fixture: ComponentFixture<LegalEntityListComponent>
  let legalEntitiesService: LegalEntityService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        LegalEntityListComponent,
        SortableDirective,
        PageHeaderComponent,
        IfPermissionsDirective,
      ],
      providers: [DatePipe],
      imports: [
        HttpClientTestingModule,
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents()
    legalEntitiesService = TestBed.inject(LegalEntityService)
  })

  // Tests are included in management-list.component.spec.ts

  it('should use correct delete message', () => {
    jest.spyOn(legalEntitiesService, 'listFiltered').mockReturnValue(
      of({
        count: 3,
        all: [1, 2, 3],
        results: [
          {
            id: 1,
            name: 'LegalEntity1',
          },
          {
            id: 2,
            name: 'LegaleEntity2',
          },
          {
            id: 3,
            name: 'LegalEntity3',
          },
        ],
      })
    )
    fixture = TestBed.createComponent(LegalEntityListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.getDeleteMessage({ id: 1, name: 'LegalEntity1' })).toEqual(
      'Do you really want to delete the legal entity "LegalEntity1"?'
    )
  })

  it('should support very old date strings', () => {
    jest.spyOn(legalEntitiesService, 'listFiltered').mockReturnValue(
      of({
        count: 1,
        all: [1],
        results: [
          {
            id: 1,
            name: 'LegalEntity1',
            last_correspondence: '1832-12-31T15:32:54-07:52:58',
          },
        ],
      })
    )
    fixture = TestBed.createComponent(LegalEntityListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
