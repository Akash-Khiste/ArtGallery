import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  imgSrc : string = '/assets/img/image-placeholder.png';
  selectedImage : any = null;
  isSubmitted : boolean ;

  formTemplate = new FormGroup({
    artist : new FormControl('', Validators.required),
    buyer : new FormControl('', Validators.required),
    imageUrl : new FormControl('', Validators.required)
  })
  constructor(private storage: AngularFireStorage, private service: ImageService) { }

  ngOnInit() {
    this.resetForm();
  }

  // function to show preview of the image to be uploaded
  showPreview(event :any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else{
      this.imgSrc;
      this.selectedImage = null;
    }
  }

  //functon to upload image into firedatabase
  onSubmit(formValue){
    this.isSubmitted = true;
    if(this.formTemplate.valid){
      //variable filepath stores the file name and path in firestore, used split to get rid of file extension, Date function used to uniqely 
      // identify the files with same name
      var filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
            formValue['imageUrl']= url;
            this.service.insertImageDetails(formValue);
            this.resetForm();
          })
        })
      ).subscribe();
    }
  }

  get formControls(){
    return this.formTemplate['controls'];
  }

  //function to reset the form after sumission of image 
  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      artist :'',
      buyer : '',
      imageUrl : ''
    });

    this.imgSrc='/assets/img/image-placeholder.png';
    this.selectedImage =null;
    this.isSubmitted = false;
  }

}
