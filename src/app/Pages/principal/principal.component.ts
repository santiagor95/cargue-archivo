import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  arrayListFile = []
  separator = ','

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  fileChanged(e) {
    const file = e.target.files[0];
    if (!file) return

    // Capturar archivo
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = (e) => {

      const dialogRef = this.dialog.open(SeparatorTypeDialog, {
        width: '400px',
      });

      dialogRef.afterClosed().subscribe(separator => {
        if (!separator) return
        this.separator = separator
        this.processFile(fileReader.result);
      });

    };
  }

  processFile(file) {
    //Separar archivo por lineas
    const stringArray = file.split('\n')

    let arrayList = []

    //recorrido de lineas
    stringArray.forEach((line, i) => {
      //separar linea por caracter especificado
      const lineArray = line.split(this.separator)
      // if (lineArray.length <= 1) return //discriminar lineas vacías
      let file: any = {}
      lineArray.forEach((element, i) => {
        file = { ...file, ['columna' + i]: element } //creacion de objeto por linea
      });
      arrayList = [...arrayList, file]//Agregar objeto a array de lineas
    });

    this.arrayListFile = arrayList;

  }

  resetFile() {
    this.arrayListFile = []
  }

}

@Component({
  selector: 'separatorTypeDialog',
  templateUrl: './separator-type-dialog.component.html',
  styleUrls: ['./principal.component.css'],
})
export class SeparatorTypeDialog {

  separatorForm: FormGroup;
  typeSeparator: string
  otherValue = 'jjj'

  constructor(
    public dialogRef: MatDialogRef<SeparatorTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
    this.separatorForm = this.fb.group({
      typeSeparator: ['', Validators.required],
      otherValue: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() {

    if (this.separatorForm.invalid) {
      return;
    }

    const { typeSeparator, otherValue } = this.separatorForm.value


    const separatorValue = typeSeparator === 'other' ? otherValue : typeSeparator
    if (!separatorValue) return
    this.dialogRef.close(separatorValue);
  }

}