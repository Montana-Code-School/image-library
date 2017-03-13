import { extendObservable } from 'mobx';

export default class ImageStore {
  constructor() {
    extendObservable(this, {
      library: [],
      searchresults: []
    });

    this.fetchLibrary = this.fetchLibrary.bind(this);
    this.saveToLibrary = this.saveToLibrary.bind(this);
    this.newGiphySearch = this.newGiphySearch.bind(this);
    this.convertToShowGifs = this.convertToShowGifs.bind(this);
  }

  fetchLibrary(){
    fetch(`/gifs`)
    .then(result => result.json())
    .then(data => {this.library = data;});
  }

  removeFromLibrary(img){
    fetch('/gifs'+img._id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this.library = this.library.filter(function(x){
      return x._id != img._id;
    }));
  }

  saveToLibrary(incomingimage, user){
    let img = incomingimage;
    img.owner = user;
    fetch(`/gifs`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: img.name,
        url: img.url,
        description: img.description,
        owner: user._id
      })
    })
    .then(result => result.json())
    .then(res => {
      img._id = res._id;
      this.library.push(img)
    });
  }

  newGiphySearch(keyword, limit, offset){
    fetch(`http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=dc6zaTOxFJmzC&limit=${limit}&offset=${offset}`)
      .then(result => result.json())
      .then(data => this.searchresults = this.convertToShowGifs(keyword, data.data));
  }

  removeFromSearchResults(img){
    this.searchresults = this.searchresults.filter(function(x){
      return x.url != img.url;
    });
  }

  convertToShowGifs(keyword, foundImages){
    return foundImages.map(image => ({
      name: image.id,
      url: image.images.original.url,
      description: keyword + " " + image.slug
    }));
  }

}
