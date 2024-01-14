import { DatePipe } from '@angular/common'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { of } from 'rxjs'
import { IfPermissionsDirective } from 'src/app/directives/if-permissions.directive'
import { SortableDirective } from 'src/app/directives/sortable.directive'
import { TagService } from 'src/app/services/rest/tag.service'
import { PageHeaderComponent } from '../../common/page-header/page-header.component'
import { TagListComponent } from './tag-list.component'
import { SafeHtmlPipe } from 'src/app/pipes/safehtml.pipe'

describe('TagListComponent', () => {
  let component: TagListComponent
  let fixture: ComponentFixture<TagListComponent>
  let tagService: TagService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        TagListComponent,
        SortableDirective,
        PageHeaderComponent,
        IfPermissionsDirective,
        SafeHtmlPipe,
      ],
      providers: [DatePipe],
      imports: [
        HttpClientTestingModule,
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents()

    tagService = TestBed.inject(TagService)
    jest.spyOn(tagService, 'listFiltered').mockReturnValue(
      of({
        count: 3,
        all: [1, 2, 3],
        results: [
          {
            id: 1,
            name: 'Tag1',
          },
          {
            id: 2,
            name: 'Tag2',
          },
          {
            id: 3,
            name: 'Tag3',
          },
        ],
      })
    )
    fixture = TestBed.createComponent(TagListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  // Tests are included in management-list.component.spec.ts

  it('should use correct delete message', () => {
    expect(component.getDeleteMessage({ id: 1, name: 'Tag1' })).toEqual(
      'Do you really want to delete the tag "Tag1"?'
    )
  })
})
