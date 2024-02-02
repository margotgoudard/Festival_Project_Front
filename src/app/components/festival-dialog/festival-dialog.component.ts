import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Festival } from 'src/app/interfaces/festival.interface';
import { FestivalService } from 'src/app/services/festival.service';


@Component({
  selector: 'app-festival-dialog',
  templateUrl: './festival-dialog.component.html',
  styleUrls: ['./festival-dialog.component.scss'],
})
export class FestivalDialogComponent {
  newFestival: Festival = { idF: 0, annee: 0, numEdition: 0 };
  newFestivalAnnee: number = 0;
  isAddingFestival: boolean = false;
  selectedfestival: number = 0;



  constructor(
    public dialogRef: MatDialogRef<FestivalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { festivals : Festival[] },
    private festivalService: FestivalService
  ) { }


  onCancelClick() {
    this.dialogRef.close(); 
  }

  onFestivalChange(event: MatSelectChange) {
    this.selectedfestival = event.value;
  }

  onAddFestivalClick(){
    this.isAddingFestival = true
  }

  
  onDeleteFestivalClick(selectedfestival: number) {
    if (selectedfestival) {
      this.festivalService.deleteFestival(selectedfestival).subscribe(() => {
        this.data.festivals = this.data.festivals.filter(festival => festival.idF !== selectedfestival);
        this.selectedfestival = 0;
      });
    }
  }

  onSaveNewFestivalClick(): void {
    this.festivalService.addFestival(this.newFestival).subscribe((savedfestival) => {
        this.data.festivals.push(savedfestival);
      this.newFestival = { idF: 0, annee: 0, numEdition: 0 };
    });
  }
  
}

