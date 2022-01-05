export default class CustomImageUploadAdapter {

  loader: any;
  constructor(loader) {
    this.loader = loader;
  }
  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          //const url  = window.URL.createObjectURL(file);       
          
          let reader = new FileReader();
          reader.readAsDataURL(file);        
          reader.onload = function (e) {      
            resolve({
              default: this.result
            });       
          }
        })
    )
  }
}