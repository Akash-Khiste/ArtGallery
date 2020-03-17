import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  imageDetailList:AngularFireList<any>
  constructor(private firebase:AngularFireDatabase) { }

  //function to retrive artartpiece(image) details from firebase database :  imageUrl, artist name & buyers name
  getimageDetailList(){
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  // function to insert artpiece(image) details into firebase database : imageUrl, artist name & buyers name
  insertImageDetails(imageDetails){
    this.imageDetailList.push(imageDetails);
  }
}
