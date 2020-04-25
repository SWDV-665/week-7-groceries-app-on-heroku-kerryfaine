import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing} from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery";
  items = [];
  errorMessage: string; 

  constructor(public navCtrl: NavController, public toastCtrl: ToastController,  public dataService: GroceriesServiceProvider, public inputDialogService: InputDialogServiceProvider, public socialSharing: SocialSharing ) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad(){
    this.loadItems();
  }

  loadItems()
  {
    this.dataService.getItems()
    .subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error);
  }

  removeItem(id)
  {
    this.dataService.removeItem(id);
  }

  shareItem(item, index) {
  
    const toast = this.toastCtrl.create({
      message: 'Sharing ' + item.name + " ...",
      duration: 3000
    });

    toast.present(); 

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.qty; 
    let subject = "Sahred via Groceries app";

    this.socialSharing.share(message,subject).then(() => {
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });
   
  }

  editItem(item, index) {

    const toast = this.toastCtrl.create({
      message: 'Editing ' + item.name + " ...",
      duration: 3000
    });

    toast.present(); 
    this.inputDialogService.showPrompt(item,index);
  }

  addItem(item) {
    this.inputDialogService.showPrompt(item);
  }

 
}
