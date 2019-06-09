import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { PhienHui } from '../models/phienhui';
import { KyHui } from '../models/kyhui';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) { }

  getTasks() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
          this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('tasks').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      });
    });
  }

  getTask(taskId) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
          this.snapshotChangesSubscription = this.afs.doc<any>('people/' + currentUser.uid + '/tasks/' + taskId).valueChanges()
            .subscribe(snapshots => {
              resolve(snapshots);
            }, err => {
              reject(err);
            });
        }
      });
    });
  }

  unsubscribeOnLogOut() {
    // remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateTask(taskKey, value) {
    return new Promise<any>((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  deleteTask(taskKey) {
    return new Promise<any>((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).delete()
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  createTask(value) {
    return new Promise<any>((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').add({
        title: value.title,
        description: value.description,
        image: value.image
      })
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  taoPhienHui(data: PhienHui) {
    return new Promise<any>((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('phienHui').add({
        tenPhienHui: data.tenPhienHui,
        idChuHui: data.idChuHui,
        loai: data.loai,
        soTien: data.soTien,
        ngayBatDau: data.ngayBatDau,
        ngayKhui: data.ngayKhui,
        trangThai: data.trangThai,
        danhSachNguoiChoiSong: data.danhSachNguoiChoiSong,
        danhSachNguoiChoiChet: data.danhSachNguoiChoiChet,
        // public idPhienHui: String;
        // public tenPhienHui: String;
        // public idChuHui: String;
        // public loai: String; // ngay OR tuan OR thang
        // public soTien: number;
        // public ngayBatDau: String;
        // public ngayKhui: String;
        // public trangThai: String; // active OR deactive
        // public danhSachNguoiChoiSong: [];
        // public danhSachNguoiChoiChet: [];
      })
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  taoKyHui(data: KyHui) {
    return new Promise<any>((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('phienHui' + '/' + data.idPhienHui).add({
        idPhienHui: data.idPhienHui,
        soKy: data.soKy,
        nguoiHot: data.nguoiHot,
        giaHot: data.giaHot,
        trangThai: data.trangThai
        // public idPhienHui: String;
        // public soKy: number;
        // public nguoiHot: String;
        // public giaHot: number;
        // public trangThai: String; // active OR deactive
      })
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  encodeImageUri(imageUri, callback) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = function () {
      const aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = c.toDataURL('image/jpeg');
      callback(dataURL);
    };
    img.src = imageUri;
  }

  uploadImage(imageURI, randomId) {
    return new Promise<any>((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function (image64) {
        imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            snapshot.ref.getDownloadURL()
              .then(res => resolve(res));
          }, err => {
            reject(err);
          });
      });
    });
  }
}
