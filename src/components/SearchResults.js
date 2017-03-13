import React from 'react';
import {observer , inject} from 'mobx-react';
import ImageComponent from './ImageComponent';

class SearchResults extends React.Component {

   constructor() {
     super();
     this.state = {};
     this.prepareImages = this.prepareImages.bind(this);
   }

  prepareImages() {
    return this.props.imageStore.searchresults.map(function(img) {
      return(<ImageComponent
              key={img.name}
              imageinfo={img}
              typeofdisplay="searchresults"/>);
    }, this);
  }

  render() {

    return (
      <div className="col-md-12">
        {this.prepareImages()}
      </div>
    );
  }
}

SearchResults.propTypes = {
  imageStore: React.PropTypes.object
};

export default inject('imageStore')(observer(SearchResults));
